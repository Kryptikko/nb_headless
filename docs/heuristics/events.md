# Events
Events are decisions presented to the Player that happen under certain conditions.

## Triggers
- New Day Start
- Party Combat End
- Party Dungeon Complete
- Member Activity Complete
- Member Tick? Complete

## Conditions
Events have have a chance to trigger on a specific trigger;

Mutually exclusive triggers?
How many events per trigger tick?

Trigger Parameters.

White-list Events 
Some Events should be available only during certain parts of the game or in certain zones.

TODO: to confirm
- Activity Start
- Activity Tick
- Activity End
- New Recruit
- New Day End

## Options
TODO: max number of options

## Implementation Details
TODO: Avoiding looping through all events on tick, so have a white-list of events that are possible based on the conditions and just roll a die on what triggers on the event.
aka. Maintain dynamically updated queues.

Member and Player Actions change which Events are queued up.
