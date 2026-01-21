import {Component, Input, inject, signal, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../../core/auth/services/auth-service';
import {RouterLink} from '@angular/router';
import {Commentaire} from '../../interfaces/commentaire';
import {User} from '../../../../core/auth/interfaces/user';

@Component({
  selector: 'app-list-commentaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list-commentaire.html',
  styleUrl: './list-commentaire.css',
})
export class ListCommentaire implements OnInit {
  @Input() taskId!: number;

  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);

  comments = signal<Commentaire[]>([]);
  nextCommentId = 1;

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(3)]]
  });

 ngOnInit() {

  this.comments.set([]);
  this.nextCommentId = 1;
}


  onSubmit() {
    if (!this.commentForm.valid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const newCommentaire: Commentaire = {
      id: this.nextCommentId++,
      content: this.commentForm.get('content')?.value || '',
      author: this.authService.currentUser() as User,
      createdAt: new Date().toISOString(),
      taskId: this.taskId
    };

    const currentComments = this.comments();
    this.comments.set([...currentComments, newCommentaire]);


    this.commentForm.reset();
  }

  deleteCommentaire(commentId: number | undefined) {
    if (!commentId) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const filtered = this.comments().filter(c => c.id !== commentId);
      this.comments.set(filtered);
    }
  }
}
