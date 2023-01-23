import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messages = this.api.getMessages();
  inputForm = this.fb.nonNullable.group({
    prompt: ['', Validators.required],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) {}

  async submitPrompt() {
    console.log('SUBMIT: ', this.inputForm.getRawValue().prompt);
    const loading = await this.loadingController.create({
      message: 'Hellooo',
      duration: 2000,
      spinner: 'bubbles',
    });
    await loading.present();
    await this.api.getCompletion(this.inputForm.getRawValue().prompt);
    this.inputForm.setValue({ prompt: '' });
    loading.dismiss();
  }

  async ngOnInit() {}
}
