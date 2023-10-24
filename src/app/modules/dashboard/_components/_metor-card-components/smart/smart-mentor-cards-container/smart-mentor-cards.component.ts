import { Component } from '@angular/core';
import { IMentor } from '@shared/interfaces/mentor.interface';

@Component({
    selector: 'app-smart-mentor-cards',
    templateUrl: './smart-mentor-cards.component.html',
    styleUrls: ['./smart-mentor-cards.component.scss'],
})
export class SmartMentorCardsComponent {
    public mentorData: IMentor[] = [
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'Mahmoud Ibrahim',
            country: 'eg',
            profilePicture:
                'https://images.squarespace-cdn.com/content/v1/572e050c4d088ea3a8f0ac9d/1652567753661-R2Q0NDAPAXPO9I7OQ6EK/850_6727-PRINT.jpg?format=1000w',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'data:image/jpeg;base64,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',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
        {
            name: 'John Doe',
            country: 'eg',
            profilePicture:
                'https://www.davidsdika.com/wp-content/uploads/2021/05/profil-linkedin-homme.jpg',
            jobTitle: 'Software Engineer',
            company: 'Google',
            rating: 4,
            numberOfReviews: 10,
            price: 50,
            currency: 'EGP',
            description:
                "👋🏻 Currently sculpting experiences for millions of weekly users as part of BBC's UX design team! 📱I specialise in digital products to achieve data-driven results, approaching my work with a user-centric mindset I enjoy solving complex problems through wireframing, design sprints, usability studies, prototyping, and facilitating",
            skills: ['Angular', 'React', 'Vue'],
            badges: ['Mentor', 'Top Rated'],
        },
    ];
}
