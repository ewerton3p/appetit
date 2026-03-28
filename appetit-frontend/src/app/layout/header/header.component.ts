import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, InputText, IconField, InputIcon, Avatar, Menu],
  template: `
    <header class="app-header" role="banner">
      <button
        class="icon-btn"
        type="button"
        (click)="toggleSidebar.emit()"
        aria-label="Alternar menu lateral"
      >
        <ng-icon name="heroBars3" size="22" aria-hidden="true" />
      </button>

      <div class="search-wrapper">
        <p-iconfield>
          <p-inputicon>
            <ng-icon name="heroMagnifyingGlass" size="16" aria-hidden="true" />
          </p-inputicon>
          <input
            pInputText
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
            class="w-full"
          />
        </p-iconfield>
      </div>

      <div class="user-area">
        <button
          class="user-btn"
          type="button"
          (click)="userMenu.toggle($event)"
          aria-haspopup="true"
          aria-label="Abrir menu do usuário"
        >
          <p-avatar label="AS" shape="circle" aria-hidden="true" />
          <span class="user-name">Admin Silva</span>
        </button>

        <p-menu #userMenu [popup]="true" [model]="menuItems" />
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1.25rem;
      height: 56px;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      z-index: 10;
      flex-shrink: 0;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.375rem;
      border: none;
      background: none;
      border-radius: 0.375rem;
      cursor: pointer;
      color: #6b7280;
      transition: background-color 0.15s, color 0.15s;
      flex-shrink: 0;

      &:hover { background-color: #f3f4f6; color: #111827; }
      &:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }
    }

    .search-wrapper {
      flex: 1;
      max-width: 400px;
      margin: 0 auto;
    }

    .user-area { margin-left: auto; }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.625rem 0.25rem 0.25rem;
      border: none;
      background: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover { background-color: #f3f4f6; }
      &:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }
  `],
})
export class HeaderComponent {
  toggleSidebar = output<void>();

  menuItems: MenuItem[] = [
    { label: 'Perfil' },
    { label: 'Configurações' },
    { separator: true },
    { label: 'Sair' },
  ];
}
