import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ACCESS_TOKEN} from '../../../domain/constant';
import 'deep-chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class ChatComponent {

  readonly requestConfig = {
    url: '/api/v1/chat',
    method: 'POST',
  };

  // Transform Deep Chat's { messages: [...] } → { message: string }
  // and inject the JWT Authorization header.
  readonly requestInterceptor = (details: any) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    details.headers = {
      ...details.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const messages: { role: string; text: string }[] = details.body?.messages ?? [];
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    details.body = {message: lastUser?.text ?? ''};
    return details;
  };

  // Transform backend { reply, actionsTaken } → Deep Chat { text }
  readonly responseInterceptor = (response: any) => {
    if (response?.reply !== undefined) {
      return {text: response.reply};
    }
    return {error: 'Unexpected response from server.'};
  };
}
