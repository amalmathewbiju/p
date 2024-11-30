import { Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-matrix-rain',
  templateUrl: 'matrix-rain.component.html',
  styleUrls: ['./matrix-rain.component.scss'],
})
export class MatrixRainComponent implements OnInit {
  @ViewChild('matrixCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input() textColor: string = '#0F0';
  @Input() backgroundOpacity: number = 0.04;

  private animationId!: number;
  private fontSize = 14;
  private drops: number[] = [];
  private characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%".split("");

  ngOnInit() {
    this.initializeCanvas();
    this.startAnimation();
  }

  @HostListener('window:resize')
  onResize() {
    this.initializeCanvas();
  }

  private initializeCanvas() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.fontSize = Math.max(14, canvas.width / 100);
    const columns = Math.floor(canvas.width / this.fontSize);
    this.drops = Array(columns).fill(1);

    ctx.fillStyle = `rgba(0, 0, 0, ${this.backgroundOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private draw() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = `rgba(0, 0, 0, ${this.backgroundOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = this.textColor;
    ctx.font = this.fontSize + 'px monospace';

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters[Math.floor(Math.random() * this.characters.length)];
      ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    this.animationId = requestAnimationFrame(() => this.draw());
  }

  private startAnimation() {
    this.animationId = requestAnimationFrame(() => this.draw());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}
