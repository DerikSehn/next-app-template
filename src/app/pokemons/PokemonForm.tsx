import { SliceStatus } from "@/lib/globals";
import { PokemonGenerationsEnum, filterPokemonsByGenerationReducer, randomizePokemonsReducer, searchPokemonsByNameReducer } from "@/redux/slices/cachedPokemonsSlice";
import { pokemonsSelector, resetPokemonsReducer } from "@/redux/slices/pokemonSlice";
import React, { useEffect, useRef, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import PokemonGenerations from "./PokemonGenerations";
import SearchInput from "@/components/native/util/SearchInput";


type Props = {
  mutatePage: React.Dispatch<React.SetStateAction<number>>;
  placeholder?: string;
  initialValue?: string;
  changeHandler?: () => void;
};

const PokemonForm = ({
  placeholder,
  initialValue = "",
  changeHandler,
  mutatePage,
}: Props) => {
  const dispatch = useDispatch();
  const pokemons = useSelector(pokemonsSelector);
  const [value, setValue] = useState<string>(initialValue);
  const [
    selectedGeneration,
    setSelectedGeneration,
  ] = useState<PokemonGenerationsEnum | null>(null);
  const inputRef = useRef(0);

  const isLoading = pokemons.status.state === SliceStatus.LOADING;

  useEffect(() => {
    if (changeHandler) {
      clearTimeout(inputRef.current);
      inputRef.current = window.setTimeout(() => {
        changeHandler();
      }, 100);
    }
  }, [value, changeHandler]);

  const submitFormHandler = () => {
    if (!isLoading) {
      dispatch(resetPokemonsReducer({} as {} & void));
      dispatch(searchPokemonsByNameReducer({ pokemonName: value }));
      mutatePage(0);
    }
  };

  const changeGenerationHandler = () => {
    if (!isLoading) {
      dispatch(resetPokemonsReducer({} as {} & void));
      dispatch(filterPokemonsByGenerationReducer({ selectedGeneration }));
      if (selectedGeneration === null) {
        dispatch(randomizePokemonsReducer({}));
        mutatePage(0);
      } else {
        mutatePage(0);
      }
    }
  };

  return (
    <div className="flex items-center justify-center flex-col   overflow-visible ">
     
          <div className="h-full w-screen"  >

        <PokemonGenerations
          selectedGeneration={selectedGeneration}
          setSelectedGeneration={setSelectedGeneration}
          changeGenerationHandler={changeGenerationHandler}
          isLoading={isLoading}
        />
     </div>
     
      
          <div className="h-20"  >

        <SearchInput
          placeholder={placeholder || "Search an item"}
          value={value}
          onSearch={() => submitFormHandler()}
          onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              submitFormHandler();
            }
          }}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setValue(e.currentTarget.value)
          }
          />
          </div>
     
      <button
        className={
          " bg-primary  rounded-md text-white font-semibold  focus:outline-none transition duration-200 ease-in-out" +
          (isLoading
            ? " opacity-25 cursor-default"
            : " hover:bg-white hover:text-primary transform hover:-translate-y-1 cursor-pointer")
        }
        onClick={submitFormHandler}
      >
        Search
      </button>
    </div>
  );
};

export default PokemonForm;