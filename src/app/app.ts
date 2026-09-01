import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, Card, Input, Tag } from '@alexandra/design-system';

@Component({
  imports: [Button, Card, Input, Tag, FormsModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly teamName = signal('Design Systems');
  protected readonly roles = signal(['Admin', 'Editor', 'Viewer']);

  protected removeRole(role: string): void {
    this.roles.update((roles) => roles.filter((r) => r !== role));
  }
}
