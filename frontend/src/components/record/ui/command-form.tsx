import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Globe, MapPin } from "lucide-react";
import * as React from "react";

interface CommandFormProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  type?: "state" | "city";
}

export function CommandForm({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  type
}: CommandFormProps) {
  const [open, setOpen] = React.useState(false);

  const Icon = type === "state" ? MapPin : type === "city" ? Globe : null;
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={(nextOpen) => {
        if (!disabled) {
          setOpen(nextOpen);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className="relative w-full group">

          {/* Ícone Padrão Embutido */}
          {Icon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors",
              open && !disabled ? "text-[#21314D]" : "text-zinc-400",
              disabled && "text-zinc-300" // Cor idêntica ao ícone do InputForm bloqueado
            )}>
              <Icon size={18} />
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open && !disabled}
            // MODIFICAÇÃO AQUI: Não passamos o disabled nativo para o botão do Shadcn 
            // para evitar que a biblioteca mude a opacidade interna do componente.
            // Em vez disso, controlamos via CSS e pointer-events.
            className={cn(
              "w-full h-11 text-sm md:text-base transition-all border rounded-xl outline-none",
              "justify-between font-normal bg-white text-left shadow-none",
              "border-zinc-200 placeholder:text-zinc-300",
              "hover:bg-white focus:ring-1 focus:ring-[#21314D]/20 focus:border-[#21314D]",
              open && !disabled && "border-[#21314D] ring-1 ring-[#21314D]/20",

              Icon ? "pl-10" : "pl-4",
              "pr-3",

              // QUANDO BLOQUEADO: Copia exatamente a estilização do seu InputForm
              disabled && "bg-zinc-50 border-zinc-200 cursor-not-allowed opacity-100"
            )}
          >
            <span className={cn(
              "truncate",
              value && !disabled && "text-[#1E1E1E]",
              disabled && "text-zinc-400", // Cor do texto idêntica ao InputForm em readOnly
              !value && !disabled && "text-zinc-300"
            )}>
              {selectedLabel || placeholder}
            </span>

            <ChevronsUpDown className={cn(
              "h-4 w-4 shrink-0 transition-opacity",
              disabled ? "text-zinc-300 opacity-100" : "opacity-50"
            )} />
          </Button>
        </div>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 shadow-xl border-zinc-100 rounded-xl"
          align="start"
        >
          <Command className="rounded-xl">
            <CommandInput
              placeholder={`Buscar...`}
              className="h-11 border-none focus:ring-0"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    className="py-2.5 cursor-pointer"
                    onSelect={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-[#21314D]",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
