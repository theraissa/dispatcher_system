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
import { Check, ChevronsUpDown, Globe, MapPin } from "lucide-react"; // Importando ícones padrões
import * as React from "react";

interface CommandFormProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  type?: "state" | "city"; // Define qual ícone padrão usar
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

  // Seleciona o ícone baseado no tipo
  const Icon = type === "state" ? MapPin : type === "city" ? Globe : null;

  // Encontra o label para exibir no botão
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full group">

          {/* Ícone Padrão Embutido */}
          {Icon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors",
              open ? "text-[#21314D]" : "text-zinc-400",
              disabled && "text-zinc-300"
            )}>
              <Icon size={18} />
            </div>
          )}

          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full h-11 text-sm md:text-base transition-all border rounded-xl outline-none",
              "justify-between font-normal bg-white text-left shadow-none",
              "border-zinc-200 placeholder:text-zinc-300",
              "hover:bg-white focus:ring-1 focus:ring-[#21314D]/20 focus:border-[#21314D]",
              open && "border-[#21314D] ring-1 ring-[#21314D]/20",

              // Se tiver ícone, adiciona padding, se não, mantém o padrão
              Icon ? "pl-10" : "pl-4",
              "pr-3",

              disabled && "bg-zinc-50 text-zinc-400 cursor-not-allowed border-zinc-200 opacity-100",
              !value && "text-zinc-300"
            )}
          >
            <span className={cn("truncate", value && "text-[#1E1E1E]")}>
              {selectedLabel || placeholder}
            </span>

            <ChevronsUpDown className={cn(
              "h-4 w-4 shrink-0 transition-opacity",
              disabled ? "opacity-20" : "opacity-50"
            )} />
          </Button>
        </div>
      </PopoverTrigger>

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
    </Popover>
  );
}
