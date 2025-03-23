# Attaching GDB to Other Processes

A common way to use GDB is to use the following command, where `very_cool_program` is a program compiled with the `-g` flag for debugging info.
```bash
gdb -q very_cool_program
```

However, GDB can also be attached to an already running process. To do that, you need to:

1. Use `ps` to get the PID of the process. I found it convenient to use the `ax` option.
2. Run GDB without a file argument
3. Attach GDB to the process

```bash
ps ax | grep "your_program" # Get the PID
gdb -q

(gdb) attach <PID>
```

It is possible to get something like the following error:
```
(gdb) attach 17057
Attaching to process 17057
ptrace: Operation not permitted.
```

This happens because, by default, it is not permitted to trace or debug a process being run by the same user. To solve this you could:

- Run GDB with root privileges:
```bash
sudo gdb -q
```

- Temporarily give yourself permission to stop a running process. The file `/proc/sys/kernel/yama/ptrace_scope` is what defines this permission. If `cat /proc/sys/kernel/yama/ptrace_scope` returns 1, it means you don't have permissions to to the process. You can solve it with:
```bash
echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope
```

