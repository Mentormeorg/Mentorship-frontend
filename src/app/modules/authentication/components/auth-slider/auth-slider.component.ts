import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-auth-slider',
  templateUrl: './auth-slider.component.html',
  styleUrls: ['./auth-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
	standalone: false
})
export class AuthSliderComponent {
  public sliderInterval = 3000;
  public slides: { imagePath: string; qoute: string }[] = [
    {
      imagePath: 'assets/images/slide1.png',
      qoute:
        '"MentorChief transformed my career journey. Having direct access to experienced mentors helped me navigate challenges and accelerate my growth as a developer."',
    },
    {
      imagePath: 'assets/images/slide1.png',
      qoute:
        '"The real-time mentorship experience is incredible. I can get instant guidance on complex problems and receive personalized career advice whenever I need it."',
    },
    {
      imagePath: 'assets/images/slide1.png',
      qoute:
        '"As a mentor, I love how MentorChief connects me with passionate learners. It\'s rewarding to share knowledge and see mentees grow in their careers."',
    },
  ];

  //TODO: handel skrew animation for tics elements

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(e: MouseEvent) {
  //     // select after and before elements on the .p-carousel dev
  //     const tics = document.querySelectorAll('.ellipses');

  //     (tics[0] as HTMLElement).style.transform = `skew(${e.clientX / 800}deg,
  // 		${e.clientY / 150}deg), translateX(50%)`;

  //     (tics[1] as HTMLElement).style.transform = `skew(${e.clientX / 800}deg,
  // 		${e.clientY / 150}deg), translateX(-50%)`;
  // }
}
