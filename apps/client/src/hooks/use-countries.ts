import { logClient } from "@repo/logger";
import type { Country } from "@repo/types";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import axios from "axios";

interface CountriesData {
  countries: Country[];
}

export default function useCountries(): {
  countries: Country[];
  loadingCountries: boolean;
  filteredCountries: Country[];
  searchCountry: string;
  setSearchCountry: Dispatch<SetStateAction<string>>;
  countriesMessage: string;
  selectedCountry: Country;
  setSelectedCountry: Dispatch<SetStateAction<Country>>;
} {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    {} as Country
  );

  useEffect(() => {
    async function getCountries(): Promise<CountriesData> {
      const response = await axios.get("/api/countries");
      const data = response.data as CountriesData;
      return data;
    }
    setLoadingCountries(true);
    getCountries()
      .then((data) => {
        setCountries(
          data.countries.sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch((error) => {
        logClient(error);
      })
      .finally(() => {
        setLoadingCountries(false);
      });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const countriesMessage =
    filteredCountries.length === 0 ? "No countries found" : "";

  return {
    countries,
    filteredCountries,
    loadingCountries,
    searchCountry,
    setSearchCountry,
    countriesMessage,
    selectedCountry,
    setSelectedCountry,
  };
}
