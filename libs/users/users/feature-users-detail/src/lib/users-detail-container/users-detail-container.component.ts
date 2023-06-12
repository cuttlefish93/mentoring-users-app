import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DetailUsersCardComponent } from '../users-detail-card/detail-users-card.component';
import { CreateUserDTO, UsersEntity, UsersFacade } from "@users/users/data-access";
import { Observable, map, tap } from 'rxjs';
import { selectQueryParam } from '@users/core/data-access';
import { Store, select } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'users-detail',
  standalone: true,
  imports: [CommonModule, DetailUsersCardComponent, LetDirective],
  templateUrl: './users-detail-container.component.html',
  styleUrls: ['./users-detail-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailComponent {
  private readonly usersFacade = inject(UsersFacade);
  private readonly store = inject(Store)
  private readonly router = inject(Router);
  public readonly userId!: number;

  public readonly user$: Observable<UsersEntity | null> = this.usersFacade.openedUser$.pipe(
    tap(
      user => {
        if (!user) {
          this.usersFacade.loadUser()
        }
      }
    )
  );
  public readonly status$ = this.usersFacade.status$;
  public readonly editMode$: Observable<boolean> = this.store.pipe(select(selectQueryParam('edit')),
    map(params => params === 'true')
  );

  public onEditUser(userData: CreateUserDTO) {
    this.usersFacade.editUser(userData, this.userId);
    // this.router.navigate(['/users', this.userId], { queryParams: { edit: false} });
    // this.router.navigate(['/home']);
  }

  onCloseUser() {
    this.router.navigate(['/home']);
  }

}