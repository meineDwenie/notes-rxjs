import {
  Component,
  Input,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as NoteSelectors from '../../notes/note.selectors';
import * as NotebookSelectors from '../../notebooks/notebook.selectors';
import { Store } from '@ngrx/store';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  count?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Sidebar implements OnInit, OnDestroy {
  @Input() appIcon = 'assets/noteboard-icon.png';
  @Input() appTitle = 'Noteboard';

  username = 'Jessa Mae Agan';
  userAvatar = 'assets/userAvatar.jpg';
  totalNotes$: Observable<number> | undefined;
  totalNotebooks$: Observable<number> | undefined;

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.totalNotes$ = this.store
      .select(NoteSelectors.selectAllNotes)
      .pipe(map((notes) => notes.length));

    this.totalNotebooks$ = this.store
      .select(NotebookSelectors.selectAllNotebooks)
      .pipe(map((notebooks) => notebooks.length));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  menuItems: MenuItem[] = [
    { id: 'all', label: 'All', icon: 'ic:round-dashboard', route: '/all' },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'fluent:note-48-regular',
      route: '/notes',
    },
    {
      id: 'notebooks',
      label: 'Notebooks',
      icon: 'hugeicons:notebook-01',
      route: '/notebooks',
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'solar:archive-outline',
      route: '/archive',
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: 'mage:trash',
      route: '/trash',
    },
  ];
}
