import {Component, DestroyRef, inject, OnInit, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from '../task/services/taskService';
import {Status, Tasks} from '../task/interfaces/tasks';
import {AuthService} from '../../core/auth/services/auth-service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);
  protected authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  allTasks = signal<Tasks[]>([]);
  isLoading = signal(false);


  totalTasks = computed(() => this.allTasks().length);

  completedTasks = computed(() =>
    this.allTasks().filter(t => t.status === Status.DONE).length
  );

  myTasks = computed(() => {
  const currentUser = this.authService.currentUser();
  if (!currentUser?.sub) return 0;
  return this.allTasks().filter(t => t.user?.id === currentUser.sub).length;
  });

  completionPercentage = computed(() => {
    const total = this.totalTasks();
    const completed = this.completedTasks();
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  });

  inProgressTasks = computed(() =>
    this.allTasks().filter(t => t.status === Status.IN_PROGRESS).length
  );
  pendingTasks = computed(() =>
  this.allTasks().filter(t => t.status === Status.PENDING).length
  );

  ngOnInit() {
    this.loadTasks();
  }


  loadTasks() {
    this.isLoading.set(true);
    this.taskService.getAllTask()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks: Tasks[]) => {
          this.allTasks.set(tasks);
          this.isLoading.set(false);
        },
        error: () => {
          console.log('Erreur lors du chargement des tâches');
          this.isLoading.set(false);
        }
      });
  }
}
