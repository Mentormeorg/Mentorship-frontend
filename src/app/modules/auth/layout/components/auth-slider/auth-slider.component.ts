import { Component, ViewEncapsulation } from '@angular/core';

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
}
