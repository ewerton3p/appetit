import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { merge } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent {
  label = input.required<string>();
  inputId = input.required<string>();
  control = input.required<AbstractControl>();
  placeholder = input('');
  type = input('text');
  required = input(false);
  autocomplete = input<string | undefined>(undefined);
  min = input<number | undefined>(undefined);
  step = input<number | undefined>(undefined);
  errors = input<Record<string, string>>({});

  formControl = computed(() => this.control() as FormControl);

  // Converte o signal `control` em um Observable para reagir a trocas de instância.
  // Quando o controle muda, `switchMap` cancela a assinatura anterior e assina
  // os eventos do novo controle — evitando vazamentos de memória.
  // `merge` combina `statusChanges` e `valueChanges` num único stream, garantindo
  // que qualquer alteração (validação ou valor) dispare a reatividade.
  // `startWith(null)` emite imediatamente ao assinar, forçando a leitura
  // inicial do estado do controle sem aguardar o próximo evento.
  // `toSignal` converte o Observable de volta para um signal do Angular,
  // permitindo que computed signals dependentes (`showError`, `activeErrors`)
  // sejam recalculados automaticamente a cada emissão.
  private controlStatus = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) =>
        merge(ctrl.events, ctrl.statusChanges, ctrl.valueChanges).pipe(startWith(null))
      )
    )
  );

  showError = computed(() => {
    this.controlStatus();
    return this.control().invalid && this.control().touched;
  });

  // Retorna a lista de erros ativos do controle que possuem mensagem configurada.
  // Depende de `controlStatus()` para ser recalculado a cada mudança de valor/status.
  activeErrors = computed(() => {
    this.controlStatus(); // dependência reativa — força reavaliação quando o controle muda
    const controlErrors = this.control().errors;
    if (!controlErrors) return []; // sem erros, retorna vazio
    return Object.keys(controlErrors)
      .filter((key) => this.errors()[key]) // considera apenas chaves com mensagem definida no input `errors`
      .map((key) => ({ key, message: this.errors()[key] })) // mapeia para { key, message }
      .slice(0, 1); // exibe no máximo 1 erro por vez
  });
}
