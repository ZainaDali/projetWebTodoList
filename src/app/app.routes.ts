import { Routes } from '@angular/router';
import {Register} from './features/auth/register/register';
import {Login} from './features/auth/login/login';
import {TaskList} from './features/task/task-list/task-list';
import {authGuard} from './core/auth/guards/auth-guard';
import {TaskForm} from './features/task/task-form/task-form';
import {TaskDetail} from './features/task/task-detail/task-detail';
import { DashboardComponent } from './features/dashboard/dashboard.component';


export const routes: Routes = [
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: 'tasks', component: TaskList, canActivate: [authGuard]},
  {path: 'tasks/:id', component: TaskDetail, canActivate: [authGuard]},
  {path: 'create', component: TaskForm, canActivate: [authGuard]},
  {path: '', redirectTo: '/tasks', pathMatch: 'full'},
  {path: 'edit/:id', component: TaskForm, canActivate: [authGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
];
