# Docker Build Environment

Docker environment for building and running AtomizerTemplate.

## Table of Contents <!-- omit in toc -->

- [Docker Build Environment](#docker-build-environment)
  - [Structure](#structure)
  - [Usage](#usage)
  - [Commands](#commands)
    - [Help](#help)
      - [Windows](#windows)
      - [Linux](#linux)
    - [Build](#build)
      - [Windows](#windows-1)
      - [Linux](#linux-1)
    - [Start](#start)
      - [Windows](#windows-2)
      - [Linux](#linux-2)
    - [Connect](#connect)
      - [Windows](#windows-3)
      - [Linux](#linux-3)
    - [Go (Start and Connect)](#go-start-and-connect)
      - [Windows](#windows-4)
      - [Linux](#linux-4)
    - [Status](#status)
      - [Windows](#windows-5)
      - [Linux](#linux-5)
    - [Stop](#stop)
      - [Windows](#windows-6)
      - [Linux](#linux-6)
    - [Destroy](#destroy)
      - [Windows](#windows-7)
      - [Linux](#linux-7)
    - [Exec](#exec)
      - [Windows](#windows-8)
      - [Linux](#linux-8)
  - [GUI Applications](#gui-applications)

## Structure

This package contains a Dockerfile, used to create the docker image to be used as the build environments, and a helper script for using that docker image.

## Usage

The helper script contains all the docker commands to build, start, connect, stop and, if necessary, destroy the build environment image.
Note that there is a powershell version of the helper script for Windows hosts and a bash version for Linux hosts. The commands and parameters are basically the same, but the powershell version commands and arguments are prefixed with a single dash (-).

The fastest way to fire up the build environment is using the ['go' ('-go' on Windows) command](#go-start-and-connect) from the AtomizerTemplate base directory. See the other available commands below.

## Commands

### Help

Prints the script usage information

#### Windows

```
> .\sdk -help

Usage: .\sdk <subcommand>

Subcommands:
  -status          Reports the status of the Docker container.
  -build           Builds the Docker container image (if needed).
    -rebuild       Rebuilds the Docker container image if it's already built.
  -start           Builds the Docker container (if needed) and runs it.
    -v <host_fdr>:<mount point>  Mounts <host_fdr> folder at the <mount_point> location inside the container.
                                 Multiple values can be defined in a comma-separated list.
                                 Ex: -v ..\repo1:/devel,c:\git\repo2:/devel2
                                 Defaults to <current folder>:/devel if not specified.
    -p <host port>:<docker port> Exposes container's <docker port> as the host's <host port>.
                                 Multiple values can be defined in a comma-separated list.
                                 Ex: -p 80:80,8080:8080
                                 Defaults to 3000:3000, 3001:3001, 6080:6080, and 9229:9229 if not specified.
  -connect         Logs into the Docker container as the default 'dev' user.
    -root          Logs into the Docker container as the root user.
  -go              Shortcut for start and connect (accepts the same arguments).
  -stop            Stops the Docker container. Does not destroy it.
  -destroy         Removes the Docker container (requires you to re-build).
  -exec <cmd>      Executes <cmd> inside the container. eg. running NPM commands
```

#### Linux

```
$ ./sdk --help

Usage: ./sdk <subcommand>

Subcommands:
├ status          Reports the status of the Docker container.
├ build           Builds the Docker container image (if needed).
│ └ --rebuild     Rebuilds the Docker container image if it's already built.
├ start           Builds the Docker container (if needed) and runs it.
│ ├ -v <host_fdr>:<mount point>  Mounts <host_fdr> folder at the <mount_point> location inside the container.
│ │                              Can be specified multiple times.
│ │                              Defaults to <current folder>:/devel if not specified.
│ └ -p <host port>:<docker port> Exposes container's <docker port> as the host's <host port>.
│                                Can be specified multiple times.
│                                Defaults to 3000:3000, 3001:3001, 6080:6080, and 9229:9229 if not specified.
├ connect         Logs into the Docker container as the default 'dev' user.
│ └ --root        Logs into the Docker container as the root user.
├ go              Shortcut for start and connect (accepts the same arguments).
├ stop            Stops the Docker container. Does not destroy it.
├ destroy         Removes the Docker container (requires you to re-build).
└ exec <cmd>      Executes <cmd> inside the container. eg. running NPM commands
```

### Build

Builds the docker environment image. This process may take several minutes. Use the -build (Windows) or --build (Linux) parameter to rebuild the image (only needed if you changed the Dockerfile).

#### Windows

`> .\docker\sdk -build`

#### Linux

`> ./docker/sdk build`

### Start

Starts the docker environment. Use the -v and -p parameters to define which folders must be mounted (shared) in the docker environment, and which ports must be exposed. If no parameters are given, the current folder will be mounted at /devel inside the docker environment, and ports 3000, 3001, 6080, 9229 will be exported.
Multiple folders and ports can be specified in a comma-separated list (Windows) or by repeating the -v/-p parameter (Linux).
Note: The home folder .npmrc file (which should contain credentials for accessing npm repositories) is automatically mounted at the dev environment's home folder.
Note 2: If you specify a -v or -p parameter, the default parameters will not be used (you must specify them along with the additional one).
Note 3: If you need to change the shared folders or exposed ports, you must stop and restart the docker environment.
Note 4: 'Start' will also build the image if it's not been built yet.

#### Windows

Using the default values:
`> .\docker\sdk -start`

Mounting just a plugin folder:
`> .\docker\sdk -start -v samples\sample-external-plugin:/devel`

Exposing default ports and additionally port 80:
`> .\docker\sdk -start -p 3000:3000,3001:3001,6080:6080,9229:9229,80:80`

#### Linux

Using the default values:
`> ./docker/sdk start`

Mounting just a plugin folder:
`> ./docker/sdk start -v samples/sample-external-plugin:/devel`

Exposing default ports and additionally port 80:
`> ./docker/sdk start -p 3000:3000 -p 3001:3001 -p 6080:6080 -p 9229:9229 -p 80:80`

### Connect

Connects to a started docker environment as the dev user. To connect as root, use the -root (Windows) or --root (Linux) parameter.

#### Windows

Connect as the dev user:
`> .\docker\sdk -connect`

Connect as the root user:
`> .\docker\sdk -connect -root`

#### Linux

Connect as the dev user:
`> ./docker/sdk connect`

Connect as the root user:
`> ./docker/sdk connect --root`

### Go (Start and Connect)

This command is a shortcut for the start and connect commands. You can use both the -v, -p and -root parameters from those commands.

#### Windows

Using the default values:
`> .\docker\sdk -go`

#### Linux

Using the default values:
`> ./docker/sdk go`

### Status

Prints the status of the docker environment (Not built, Built, Running).

#### Windows

`> .\docker\sdk -status`

#### Linux

`> ./docker/sdk status`

### Stop

Stops a running docker environment.
Note: The image state will be reset to the default (as if the image had just been built).

#### Windows

`> .\docker\sdk -stop`

#### Linux

`> ./docker/sdk stop`

### Destroy

Destroys the docker environment image. After doing this, the 'build' command will have to be executed before the image can be used.

#### Windows

`> .\docker\sdk -destroy`

#### Linux

`> ./docker/sdk destroy`

### Exec

Executes a command inside the docker image. Useful for CI/CD tools.

#### Windows

Goes to the sample plugin folder and builds it:
`> .\docker\sdk -exec "npm run build"`

#### Linux

Goes to the sample plugin folder and builds it:
`> ./docker/sdk exec "npm run build"`

## GUI Applications

The docker environment contains a VNC server on display 99. A GUI application launched inside the docker environment will be shown in this display by default.
The environment also provides a Web VNC client (noVNC) which can be accessed on port 6080. This port is forwarded by default to the host machine.
To view the docker environment display in the Web VNC client, just access <http://localhost:6080/vnc_auto.html> from the host machine.
Note that the port forwarding can be changed using the -p parameter when starting the docker environment.
