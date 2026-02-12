import { Component, AfterViewInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LucideAngularModule, Brain, Compass, MapPin, Rocket, Facebook, Twitter, Instagram, Linkedin, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PreloaderComponent } from '../../shared/preloader/preloader.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LucideAngularModule, PreloaderComponent],
  providers: [
    { provide: LUCIDE_ICONS, useValue: new LucideIconProvider({ Brain, Compass, MapPin, Rocket, Facebook, Twitter, Instagram, Linkedin }) }
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // ✅ CORREGIDO
})
export class PwaHomeComponent implements AfterViewInit, OnDestroy {

  quotes = [
    { text: 'Encontré mi camino', img: 'assets/student1.jpg' },
    { text: 'La IA me sorprendió', img: 'assets/student2.jpg' }
  ];

  // ✅ VARIABLES PRELOADER
  isLoading = true;
  loadingProgress = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  /* ===============================
     PRELOADER
  =============================== */
  initPreloader() {
    const interval = setInterval(() => {
      if (this.loadingProgress < 100) {

        this.loadingProgress += Math.floor(Math.random() * 8) + 3;

        if (this.loadingProgress > 100) {
          this.loadingProgress = 100;
        }

      } else {

        clearInterval(interval);

        // Animación suave de salida
        gsap.to('.preloader', {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            this.isLoading = false;
            ScrollTrigger.refresh();
          }
        });

      }
    }, 120);
  }

  /* ===============================
     INIT
  =============================== */
  ngAfterViewInit() {

    // 🔥 INICIAMOS PRELOADER
    this.initPreloader();

    // Esperamos a que termine antes de animaciones pesadas
    setTimeout(() => {
      this.initCursorAnimation();
      this.initMagneticButtons();
      this.initProfessionalTextAnimations();
      this.initImageScrollAnimations();
      this.init3DTiltEffect();
    }, 1800);
  }

  /* ===============================
     CURSOR PERSONALIZADO
  =============================== */
  initCursorAnimation() {
    const cursorDot = this.document.querySelector('.cursor-dot');
    const cursorOutline = this.document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
      gsap.set(cursorDot, { x: e.clientX, y: e.clientY });

      gsap.to(cursorOutline, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
    });

    const interactables = this.document.querySelectorAll('button, a, .info-image, .cta-button, .cta-button-1');

    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () =>
        this.renderer.addClass(this.document.body, 'hovering')
      );
      el.addEventListener('mouseleave', () =>
        this.renderer.removeClass(this.document.body, 'hovering')
      );
    });
  }

  /* ===============================
     BOTONES MAGNÉTICOS
  =============================== */
  initMagneticButtons() {
    const buttons = this.document.querySelectorAll('.cta-button, .cta-button-1');

    buttons.forEach((btn: any) => {

      btn.addEventListener('mousemove', (e: MouseEvent) => {

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }

  /* ===============================
     TEXT ANIMATIONS
  =============================== */
  initProfessionalTextAnimations() {
    const titles = this.document.querySelectorAll('.reveal-text');

    titles.forEach((title: any) => {

      this.splitTextToSpans(title);
      const chars = title.querySelectorAll('.char');

      gsap.fromTo(chars,
        {
          y: 80,
          opacity: 0,
          rotationX: -90,
          filter: 'blur(10px)'
        },
        {
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          rotationX: 0,
          filter: 'blur(0px)',
          stagger: 0.04,
          duration: 1,
          ease: 'back.out(1.5)'
        }
      );
    });
  }

  splitTextToSpans(element: HTMLElement) {
    const text = element.innerText.trim();
    element.innerHTML = '';

    text.split('').forEach(char => {
      const span = this.document.createElement('span');
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      span.classList.add('char');
      span.style.display = 'inline-block';
      span.style.transformOrigin = 'bottom center';
      element.appendChild(span);
    });
  }

  /* ===============================
     SCROLL ANIMATIONS
  =============================== */
  initImageScrollAnimations() {
    const sections = gsap.utils.toArray('.info-section');

    sections.forEach((section: any) => {

      const image = section.querySelector('.info-image img');

      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      if (image) {
        gsap.to(image, {
          scrollTrigger: {
            trigger: section,
            scrub: 1
          },
          y: -50,
          scale: 1.1,
          ease: 'none'
        });
      }
    });
  }

  /* ===============================
     3D TILT
  =============================== */
  init3DTiltEffect() {
    const imagesContainers = gsap.utils.toArray('.info-image');

    imagesContainers.forEach((container: any) => {

      const img = container.querySelector('img');
      if (!img) return;

      container.addEventListener('mousemove', (e: MouseEvent) => {

        const rect = container.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width - 0.5;
        const yPos = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(img, {
          rotationY: xPos * 20,
          rotationX: -yPos * 20,
          scale: 1.05,
          transformPerspective: 500,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(img, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
