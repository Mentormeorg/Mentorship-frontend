import {
    Component,
    HostListener,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'app-auth-slider',
    templateUrl: './auth-slider.component.html',
    styleUrls: ['./auth-slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AuthSliderComponent {
    public sliderInterval = 3000;
    public slides: { imagePath: string; qoute: string }[] = [
        {
            imagePath: 'assets/images/slide1.png',
            qoute: '“Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.”',
        },
        {
            imagePath: 'assets/images/slide1.png',
            qoute: '“Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.”',
        },
        {
            imagePath: 'assets/images/slide1.png',
            qoute: '“Lorem ipsum dolor sit amet consectetur. Nec aenean pellentesque est porta gravida aliquam sed.”',
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
