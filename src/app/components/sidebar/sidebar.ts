import {
  Component,
  Input,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class Sidebar {
  @Input() appIcon = 'assets/noteboard-icon.png';
  @Input() appTitle = 'Noteboard';

  username = 'Jessa Mae Agan';
  userAvatar = 'assets/userAvatar.jpg';
  totalNotes = 35;
  totalNotebooks = 5;

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
