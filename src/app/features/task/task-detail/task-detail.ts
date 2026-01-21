import {Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';
import {TaskService} from '../services/taskService';
import {Status, Tasks} from '../interfaces/tasks';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router, RouterLink} from '@angular/router';
import {TaskStatusPipe} from '../pipe/task-status-pipe';
import {DatePipe} from '@angular/common';
import {ListCommentaire} from '../CommentsList/list-commentaire';
@Component({
  selector: 'app-task-detail',
  imports: [
    RouterLink,
    TaskStatusPipe,
    DatePipe,
    ListCommentaire
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  @Input() id?: string;

  private taskService: TaskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  task = signal<Tasks | null>(null);

  ngOnInit() {
    this.getTaskById();
  }

  getTaskById() {
    const taskId = Number(this.id);
    if (isNaN(taskId)) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.taskService.getTaskById(taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task: Tasks) => this.task.set(task),
        error: () => {
          console.log('Erreur lors de la récupération de la tâche');
          this.router.navigate(['/tasks']);
        }
      });
  }

  getStatusColor(status: Status | undefined) {
    switch (status) {
      case Status.PENDING: return 'bg-red-100 text-red-800';
      case Status.IN_PROGRESS: return 'bg-amber-100 text-amber-800';
      case Status.DONE: return 'bg-green-100 text-green-800';
      default: return 'bg-red-100 text-red-800';
    }
  }
}
