import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ErrorShowingComponent } from "./error-showing/error-showing.component";

@Injectable({
    providedIn: 'root'
})
export class MovieHttpInteceptor implements HttpInterceptor {

    constructor(private _snackBar: MatSnackBar) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(event => {
            if (event instanceof HttpErrorResponse) {
                console.log(event.statusText)
            }
        }),
            catchError((err) => {
                console.log(err);
                this._snackBar.openFromComponent(ErrorShowingComponent, {
                    duration: 5000,
                    panelClass: 'error-panel',
                    data: err.error.Error
                });
                return throwError(err);
            })

        )
    }

}