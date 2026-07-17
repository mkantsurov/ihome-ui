# Copilot Instructions — Angular Chat UI for I-Home AI Assistant

## Overview

Implement an Angular chat UI that allows authenticated users to converse with the I-Home AI assistant.
The backend endpoint is `POST /api/v1/chat`, secured by JWT and provided by `ChatController`.

---

## Backend API Contract

### Endpoint
```
POST /api/v1/chat
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Request body
```json
{ "message": "What is the current temperature in the living room?" }
```
- `message` — non-blank string, the user's natural language query.

### Response body
```json
{
  "reply": "The current temperature in the living room is 22.3°C.",
  "actionsTaken": []
}
```
- `reply` — the LLM's text response (may contain markdown).
- `actionsTaken` — list of action strings (usually empty; may contain device actions for ADMIN users).

### Auth behaviour
- Any authenticated user can use the chat (read-only home status queries).
- ADMIN users can also issue control commands (mode changes, output state changes) via the same endpoint — no special client handling needed.
- JWT is added automatically by `JwtInterceptor` — no manual header logic required in the service.

### Error handling
- `400` — blank message (validation error).
- `401` — expired or missing JWT → `JwtInterceptor` already redirects to sign-in.
- `500` — LLM or tool execution error → show user-friendly error message.

---

## Files to Create

```
ihome-ui/src/app/
├── services/
│   └── chat.service.ts                          # HTTP service for /api/v1/chat
├── domain/
│   ├── chat-request.ts                          # { message: string }
│   └── chat-response.ts                         # { reply: string; actionsTaken: string[] }
└── ui/main/
    └── chat/
        ├── chat.component.ts
        ├── chat.component.html
        └── chat.component.scss
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/ui/main/main-sidenav/menu-items.ts` | Add `chat` menu item |
| `src/app/app-routing.module.ts` | Add `/main/chat` route |

---

## Domain Models

### `src/app/domain/chat-request.ts`
```typescript
export interface ChatRequest {
  message: string;
}
```

### `src/app/domain/chat-response.ts`
```typescript
export interface ChatResponse {
  reply: string;
  actionsTaken: string[];
}
```

---

## Chat Service

### `src/app/services/chat.service.ts`
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest } from '../domain/chat-request';
import { ChatResponse } from '../domain/chat-response';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = '/api/v1/chat';
  private http = inject(HttpClient);

  sendMessage(message: string): Observable<ChatResponse> {
    const req: ChatRequest = { message };
    return this.http.post<ChatResponse>(this.baseUrl, req);
  }
}
```

---

## Chat Component

### Requirements
- Standalone component (matches project convention — see `MessagesComponent`).
- Uses Angular Material: `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatIconModule`, `MatProgressSpinnerModule`, `MatListModule`.
- Uses `@angular/material` SCSS theme via `@use '@angular/material' as mat;`.
- Message bubbles: user messages on the right, assistant replies on the left.
- Display `actionsTaken` items if non-empty (e.g., as a small chip list below the reply).
- Show a spinner while waiting for the response.
- Auto-scroll to the latest message after each exchange.
- Disable the send button and input while a request is in-flight.
- Send on Enter key (`(keydown.enter)="sendMessage()"`) — Shift+Enter inserts a newline.
- Show an inline error banner if the API call fails.
- Render markdown in `reply` using `innerHTML` **only after sanitizing** with Angular's `DomSanitizer` — or use a library like `marked` if already available.

### Component skeleton (`chat.component.ts`)
```typescript
import { Component, ElementRef, viewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatService } from '../../../services/chat.service';
import { ChatResponse } from '../../../domain/chat-response';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  actionsTaken?: string[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export default class ChatComponent {
  messages = signal<ChatMessage[]>([]);
  userInput = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly messageList = viewChild<ElementRef>('messageList');

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading()) return;

    this.messages.update(msgs => [...msgs, { role: 'user', text }]);
    this.userInput = '';
    this.loading.set(true);
    this.errorMessage.set(null);

    this.chatService.sendMessage(text).subscribe({
      next: (res: ChatResponse) => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', text: res.reply, actionsTaken: res.actionsTaken },
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.errorMessage.set('Failed to get a response. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messageList()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
```

### Template (`chat.component.html`)
```html
<div class="chat-container">
  <h3>AI Assistant</h3>

  <div class="message-list" #messageList>
    @for (msg of messages(); track $index) {
      <div class="message-bubble" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
        <span class="message-text">{{ msg.text }}</span>
        @if (msg.actionsTaken && msg.actionsTaken.length > 0) {
          <ul class="actions-taken">
            @for (action of msg.actionsTaken; track $index) {
              <li>{{ action }}</li>
            }
          </ul>
        }
      </div>
    }
    @if (loading()) {
      <div class="message-bubble assistant loading">
        <mat-spinner diameter="20"/>
      </div>
    }
  </div>

  @if (errorMessage()) {
    <div class="error-banner">{{ errorMessage() }}</div>
  }

  <div class="input-row">
    <mat-form-field class="input-field" appearance="outline">
      <mat-label>Ask about your home…</mat-label>
      <textarea matInput
                [(ngModel)]="userInput"
                rows="2"
                [disabled]="loading()"
                (keydown.enter)="$event.shiftKey ? null : (sendMessage(); $event.preventDefault())">
      </textarea>
    </mat-form-field>
    <button mat-icon-button color="primary"
            [disabled]="loading() || !userInput.trim()"
            (click)="sendMessage()">
      <mat-icon>send</mat-icon>
    </button>
  </div>
</div>
```

### Styles (`chat.component.scss`)
```scss
@use '@angular/material' as mat;

.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  max-width: 800px;
  margin: 20px auto;
  padding: 0 16px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;

  &.user {
    align-self: flex-end;
    background-color: #1976d2;
    color: white;
    border-bottom-right-radius: 4px;
  }

  &.assistant {
    align-self: flex-start;
    background-color: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 4px;
  }

  &.loading {
    background: transparent;
  }
}

.actions-taken {
  font-size: 0.8em;
  margin-top: 6px;
  padding-left: 16px;
  opacity: 0.8;
}

.error-banner {
  color: #c62828;
  background: #ffebee;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 0;

  .input-field {
    flex: 1;
  }
}
```

---

## Routing

### `src/app/app-routing.module.ts` — add inside `routes` array (under `main` children):
```typescript
{ path: 'chat', loadComponent: () => import('./ui/main/chat/chat.component') },
```

---

## Side-Navigation Menu

### `src/app/ui/main/main-sidenav/menu-items.ts` — add entry:
```typescript
{
  icon: 'smart_toy',
  label: 'AI Chat',
  route: 'chat',
  implemented: true,
  roles: [Role.ADMIN, Role.SUPERVISOR, Role.CHILDREN_ROOM1_MANAGER, Role.CHILDREN_ROOM2_MANAGER, Role.AUTHORIZED_GUEST],
},
```
Place it **before** the Sign-Out entry.

---

## Conventions to Follow

| Convention | Detail |
|---|---|
| Component style | `standalone: true` with explicit `imports` array |
| Template control flow | Angular 17+ `@for`, `@if` syntax (not `*ngFor`, `*ngIf`) |
| Signals | Use `signal()` / `computed()` for reactive state |
| `viewChild` | Use `viewChild<ElementRef>('ref')` (not `@ViewChild`) |
| HTTP | Inject `HttpClient` via `inject()` or constructor |
| SCSS | `@use '@angular/material' as mat;` at top of each `.scss` file |
| Lazy loading | Use `loadComponent: () => import(...)` for new route |
| Error handling | Use `ErrorHandlerService` for toast/notification errors where available |

---

## Notes

- The backend is **stateless per request** — the full conversation history is not preserved server-side. Each `POST /api/v1/chat` call is independent. The client should maintain conversation history purely in the component's `messages` signal for display.
- The LLM response (`reply`) may contain **Markdown** — consider rendering it safely. If `marked` or `ngx-markdown` is not already a dependency, plain `white-space: pre-wrap` CSS is an acceptable fallback.
- The `actionsTaken` field is currently always `[]`. Rendering it is future-proofing.
- No WebSocket or streaming is needed — the endpoint is a simple synchronous REST call.
- JWT auth is handled transparently by the existing `JwtInterceptor` — no changes needed there.
