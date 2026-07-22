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

  // Send the last 5 messages as conversation context for the backend.
  readonly requestInterceptor = (details: any) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    details.headers = {
      ...details.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    // details.body.messages already contains only the last 5 messages
    // thanks to the requestBodyLimits setting. Forward them as conversation history.
    const messages: { role: string; text: string }[] = details.body?.messages ?? [];
    details.body = {messages};
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
