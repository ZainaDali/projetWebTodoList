import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersService} from '../users-service';
import {User} from '../../../core/auth/interfaces/user';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);

  users = signal<User[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.usersService.getAllUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users: User[]) => {
          this.users.set(users);
          this.isLoading.set(false);
        },
        error: () => {
          console.log('Erreur lors du chargement des utilisateurs');
          this.isLoading.set(false);
        }
      });
  }

  banUser(userId: number | undefined) {
    if (!userId) return;

    if (confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) {
      const filtered = this.users().filter(u => u.id !== userId);
      this.users.set(filtered);

      alert('Utilisateur banni avec succès!');
    }
  }
}
