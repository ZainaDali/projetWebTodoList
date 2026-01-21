import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task/services/taskService';
import { Tasks, Status } from '../task/interfaces/tasks';
import { AuthService } from '../../core/auth/services/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // ✅ OBLIGATOIRE POUR *ngIf
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  tasks = signal<Tasks[]>([]);

  ngOnInit(): void {
    this.taskService.getAllTask()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          console.log('📊 Dashboard tasks:', tasks);
          this.tasks.set(tasks);
        },
      });
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser();
    console.log('👤 User connecté:', user);
    return user?.role?.toUpperCase() === 'ADMIN';
  }

  get totalTasks(): number {
    return this.tasks().length;
  }

  get doneTasks(): number {
    return this.tasks().filter(t => t.status === Status.DONE).length;
  }

  get myTasks(): number {
    const user = this.authService.currentUser();
    if (!user) return 0;

    return this.tasks().filter(
      t => t.targetUserId === String(user.id)
    ).length;
  }

  get completionPercent(): number {
    return this.totalTasks === 0
      ? 0
      : Math.round((this.doneTasks / this.totalTasks) * 100);
  }
}







