import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
    private _activeRoute: ActivatedRoute = inject(ActivatedRoute);
    constructor() {}

    ngOnInit(): void {
        console.log('callback component');
        console.log(
            this._activeRoute.params.subscribe((params) => {
                console.log(params);
            })
        );
    }
}
