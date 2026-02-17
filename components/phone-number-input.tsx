import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Dispatch, useEffect, useState } from "react";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@/components/ui/dialog";
import { countries } from "@/constants/countries";

export default function PhoneNumberInput({
  setPhone,
  dialog,
  phone,
  label,
  labelClassName,
}: Readonly<{
  setPhone: Dispatch<React.SetStateAction<string | undefined>>;
  dialog: boolean;
  phone?: string;
  label?: string;
  labelClassName?: string;
}>) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("GH");
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (phoneNumber) {
      const formatter = new AsYouType(
        countries.find((c) => c.code === selectedCountry)?.code,
      );
      const formatted = formatter.input(phoneNumber);

      const number = formatter.getNumber();

      const formattedPhone = number?.number.replace("+", "");
      setPhone(formattedPhone);

      setFormattedNumber(formatted);

      const valid = isValidPhoneNumber(
        phoneNumber,
        countries.find((c) => c.code === selectedCountry)?.code,
      );
      setIsValid(valid);
    } else {
      setFormattedNumber("");
      setIsValid(null);
    }
  }, [phoneNumber, selectedCountry, setPhone]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const dialCodeRegex = new RegExp(
      `^\\${countries.find((c) => c.code === selectedCountry)?.dialCode}`,
    );
    const valueWithoutDialCode = value.replace(dialCodeRegex, "");

    const digitsOnly = valueWithoutDialCode.replace(/\D/g, "");
    setPhoneNumber(digitsOnly);
  };

  return (
    <div className="space-y-2">
      <Label className={cn(labelClassName ?? "")}>
        {label ?? "Phone Number"}
      </Label>
      <div className="flex gap-x-2">
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[130px] justify-between px-2"
            >
              <div className="flex items-center gap-x-2">
                <span className="text-base">
                  {countries.find((c) => c.code === selectedCountry)?.flag}
                </span>
                <span>
                  {countries.find((c) => c.code === selectedCountry)?.dialCode}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            {dialog ? (
              <CommandDialog open={open} onOpenChange={setOpen}>
                <DialogTitle></DialogTitle>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.dialCode}`}
                        onSelect={() => handleCountryChange(country.code)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCountry === country.code
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex items-center gap-x-2">
                          <span className="text-base">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-muted-foreground">
                            {country.dialCode}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            ) : (
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.dialCode}`}
                        onSelect={() => handleCountryChange(country.code)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCountry === country.code
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex items-center gap-x-2">
                          <span className="text-base">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-muted-foreground">
                            {country.dialCode}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </PopoverContent>
        </Popover>
        <div className="relative flex-1">
          <Input
            type="tel"
            id="phone"
            value={formattedNumber}
            onChange={handlePhoneNumberChange}
            className={cn(
              "focus-visible:ring-ring",
              isValid === true &&
                "border-green-500 focus-visible:ring-green-500",
              isValid === false && "border-red-500 focus-visible:ring-red-500",
            )}
            placeholder="Phone number"
          />
        </div>
      </div>
    </div>
  );
}
