import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NgIcon } from '@ng-icons/core';

export interface SidebarItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  host: { class: 'sidebar-host' },
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  items: SidebarItem[] = [
    { label: 'Dashboard', route: '/', icon: 'heroHome' },
    {
      label: 'Cadastros',
      icon: 'heroClipboardDocumentList',
      children: [
        { label: 'Produtos', route: '/products' },
        { label: 'Categorias', route: '/categories' },
      ],
    },
    { label: 'Usuários', route: '/users', icon: 'heroUsers' },
    { label: 'Configurações', route: '/settings', icon: 'heroCog6Tooth' },
  ];

  private manuallyExpanded = signal<Set<string>>(new Set());

  isExpanded(item: SidebarItem): boolean {
    if (this.manuallyExpanded().has(item.label)) return true;
    return item.children?.some(child => child.route && this.currentUrl().startsWith(child.route)) ?? false;
  }

  toggleItem(label: string): void {
    this.manuallyExpanded.update(set => {
      const next = new Set(set);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }
}
