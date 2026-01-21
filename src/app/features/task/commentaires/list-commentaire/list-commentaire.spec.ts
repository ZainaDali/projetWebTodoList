import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommentaire } from './list-commentaire';

describe('ListCommentaire', () => {
  let component: ListCommentaire;
  let fixture: ComponentFixture<ListCommentaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCommentaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCommentaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
