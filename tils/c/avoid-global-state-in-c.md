# How to Avoid Global State in C

Global state in programming is problematic for several reasons. 

One reason is because any part of the program can alter the global state. This makes it difficult to debug the program, because it's difficult to tell which part of the program can be causing a particular behavior.

Other reason is that any new code that alters global state potentially affects all other code that depends on that state, making it easier to introduce bugs in the codebase.

Another reason is because global state makes it difficult to test the program, since all tests will depend on a particular state to be properly setup.

## Passing state as a local variable

One solution to the problem is to use a state type and pass it as a variable to all functions that alter the state:

```c title:"state.h"
/// state object:
struct state {
    int some_value;
};

/// Initializes state
/// @return zero on success
int state_init(struct state *s);

/// Destroys state
/// @return zero on success
int state_fini(struct state *s);

/// Does some operation with state
/// @return zero on success
int state_set_value(struct state *s, int new_value);

/// Retrieves some operation from state
/// @return zero on success
int state_get_value(struct state *s, int *value);
```

```c title:"state.c"
#include "state.h"

int state_init(struct state *s) {
    s->some_value = -1;
    return 0;
}

int state_fini(struct state *s) {
    // add free() etc. if needed here
    // call fini of other objects here
    return 0;
}

int state_set_value(struct state *s, int value) {
    if (value < 0) { 
        return -1; // ERROR - invalid argument
                   // you may return EINVAL here
    }
    s->some_value = value;
    return 0; // success
}

int state_get_value(struct state *s, int *value) {
    if (s->some_value < 0) { // value not set yet
        return -1;
    }
    *value = s->some_value;
    return 0;
}
```

```c title:"main.c"
#include "state.h"
#include <stdlib.h>
#include <stdio.h>

int main() {
    struct state state; // local variable
    int err = state_init(&state);
    if (err) abort();

    int value;
    err = state_get_value(&state, &value);
    if (err != 0) {
        printf("Getting value errored: %d\n", err);
    }

    err = state_set_value(&state, 50);
    if (err) abort();
    err = state_get_value(&state, &value);
    if (err) abort();
    printf("Current value is: %d\n", value);

    err = state_fini(&state);
    if (err) abort();
}
```

In practice, `state` will have more fields than just `some_value`. The key is to pass `state` down the stack call as little as possible, with the lower level functions getting passed references only to the fields of `state` that they absolutely need access to.
