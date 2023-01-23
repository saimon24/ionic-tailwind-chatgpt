import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';

const configuration = new Configuration({
  apiKey: environment.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

enum Creator {
  Me = 0,
  Bot = 1,
}

interface Message {
  text: string;
  from: Creator;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  dummyMessages = [
    {
      text: 'What is Javascript?',
      from: Creator.Me,
    },
    {
      text: 'Javascript is a scripting language that is used to create interactive webpages and applications. It is an object-oriented programming language that can be used to create dynamic, responsive webpages and applications. It can be used to create games, 3D graphics, and even artificial intelligence within the browser.',
      from: Creator.Bot,
    },
  ];
  private messages = new BehaviorSubject<Message[]>(this.dummyMessages);

  constructor(private http: HttpClient) {}

  async getCompletion(prompt: string) {
    const newMessage = {
      text: prompt,
      from: Creator.Me,
    };
    this.messages.next([...this.messages.getValue(), newMessage]);

    const aiResult = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0.9, // Higher values means the model will take more risks.
      max_tokens: 2048, // The maximum number of tokens to generate in the completion.
      frequency_penalty: 0.5, // Number between -2.0 and 2.0.
      presence_penalty: 0, // Number between -2.0 and 2.0.
    });
    console.log(
      '🚀 ~ file: api.service.ts:26 ~ ApiService ~ getCompletion ~ aiResult',
      aiResult
    );

    const response =
      aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';

    const botMessage = {
      text: response,
      from: Creator.Bot,
    };

    this.messages.next([...this.messages.getValue(), botMessage]);
    return true;
  }

  getMessages() {
    return this.messages.asObservable();
  }
}
