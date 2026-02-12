import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule], // 👈 AGREGAR ESTO
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent {
  @Input() isLoading: boolean = true;
  @Input() progress: number = 0;
}
