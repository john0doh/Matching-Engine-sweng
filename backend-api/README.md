# Backend

## Getting the fields in a database

To get the fields in a database use localhost:9000/db/fields

You can get the types of those fields using /db/types

## Matching

To match use localhost:9000/db/match

This is followed by attribute.equalityType.value, for example if I wanted to find all movies released in 2005 you would use localhost:9000/db/match/year.eq.2005

The supported equality types are eq for equals, lt for less than, gt for greater than, lte and gte for less than equals and greater than equals.

## Matching using tolerance

To match using tolerances include ?rtol=toleranceValue or ?atol=toleranceValue after. For example if you want all movies released between 2000 and 2010, you would search 2005 with 5 years of absolute tolerance. localhost:9000/db/match/year.eq.2005?atol=5

This will only work on number types and will be ignored for strings, booleans etc.

## Matching with logical operators

Send several request of type localhost:9000/db/(and|or)/attribute.equalityType.value/?(rtol|atol)=toleranceValue
Then when you want to resolve send localhost:9000/db/match/resolve

Handles requests with conflicting and/or statements but only because they'll return 0

You can clear what is currently due to be resolved with /db/match/delete