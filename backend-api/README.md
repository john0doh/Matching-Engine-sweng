# Backend

## Getting the fields in a database

To get the fields in a database use localhost:9000/db/fields

## Matching

To match use localhost:9000/db/match

This is followed by attribute.equalityType.value, for example if I wanted to find all movies released in 2005 you would use localhost:9000/db/match/year.eq.2005

The supported equality types are eq for equals, lt for less than and gt for greater than.

## Matching using tolerance (NYI)

To match using tolerances include ?rtol=toleranceValue or ?atol=toleranceValue after. For example if you want all movies released between 2000 and 2010, you would search 2005 with 5 years of absolute tolerance. localhost:9000/db/match/year.eq.2005?atol=5

This will only work on number types and will be ignored for strings, booleans etc.

## Matching with logical operators

Not decided how this will work yet