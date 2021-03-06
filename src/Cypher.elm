module Cypher 
  exposing 
    ( Cypher
    , Substitutions
    , all
    , random
    , change
    , substitute
    )


import Char exposing (isUpper)
import Dict exposing (Dict)
import List exposing (head)
import String exposing (dropLeft, fromChar, toList, toLower, toUpper)



type alias Cypher =
  { name : String
  , pure : Bool
  , subs : Substitutions
  }

type alias Substitutions = Dict String String



-- FUNCTIONS
all : List Cypher
all = 
  [ { name = "Al Bhed", pure = True, subs = albhed }
  , { name = "Caesar", pure = True, subs = caesar }
  ]

random : Cypher
random = 
  case head all of 
    Just value -> value
    Nothing -> { name = "Empty", pure = False, subs = Dict.fromList [] }

change : Cypher -> String -> String -> Cypher
change cypher key str = 
  { cypher
  | subs = Dict.insert key str cypher.subs
  , pure = False
  }

substitute : Cypher -> String -> String
substitute cypher input =
  case input |> toList |> head of
    Just character -> 
      case Dict.get (character |> fromChar |> toLower) cypher.subs of
        Just value ->
          ( if isUpper character then toUpper value else value) ++ substitute cypher (dropLeft 1 input)
        Nothing -> fromChar character ++ substitute cypher (dropLeft 1 input)
    Nothing -> ""




-- EXAMPLES
albhed : Substitutions
albhed = 
  Dict.fromList
    [ ("a","y")
    , ("b","p")
    , ("c","l")
    , ("d","t")
    , ("e","a")
    , ("f","v")
    , ("g","k")
    , ("h","r")
    , ("i","e")
    , ("j","z")
    , ("k","g")
    , ("l","m")
    , ("m","s")
    , ("n","h")
    , ("o","u")
    , ("p","b")
    , ("q","x")
    , ("r","n")
    , ("s","c")
    , ("t","d")
    , ("u","i")
    , ("v","j")
    , ("w","f")
    , ("x","q")
    , ("y","o")
    , ("z","w")
    ]

caesar : Substitutions
caesar =
  Dict.fromList
    [ ("a","x")
    , ("b","y")
    , ("c","z")
    , ("d","a")
    , ("e","b")
    , ("f","c")
    , ("g","d")
    , ("h","e")
    , ("i","f")
    , ("j","g")
    , ("k","h")
    , ("l","i")
    , ("m","j")
    , ("n","k")
    , ("o","l")
    , ("p","m")
    , ("q","n")
    , ("r","o")
    , ("s","p")
    , ("t","q")
    , ("u","r")
    , ("v","s")
    , ("w","t")
    , ("x","u")
    , ("y","v")
    , ("z","w")
    ]
