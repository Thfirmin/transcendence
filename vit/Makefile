# Variables |===================================================================
NAME = ft_transcendence

DOCKER_CMD = $(shell bash maketools/docker-finder)
COMPOSE_CMD = $(shell bash maketools/compose-finder)
COMPOSE_FILE = srcs/docker-compose.yml

TXT_BLACK = \033[30m
TXT_RED = \033[31m
TXT_GREEN = \033[32m
TXT_YELLOW = \033[33m
TXT_BLUE = \033[34m
TXT_MAGENTA = \033[35m
TXT_CYAN = \033[36m
TXT_GREY = \033[37m
TXT_WHITE = \033[38m
TXT_NULL = \033[0m


.DEFAULT_GOAL := all

# Customize Rules

middleware:
ifeq (,$(DOCKER_CMD))
	echo "Error: docker not permited" &>/dev/stderr
	exit 21
endif

volgen:
	maketools/volmanager gen

volup:
	maketools/volmanager up

all $(NAME) clean fclean re: middleware

# Mandatory Rules
all: $(NAME)
	
$(NAME): up

clean: down

fclean: purge

re: fclean all

# Docker Compose rules |=====================================================
.PHONY: up down prune starts stop restart pause unpause

up build down prune start stop restart pause unpause: middleware 

up:	flags=-d
up: volup
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) up $(flags) $(id)

build: flags=-d
build: volup
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) up --build $(flags) $(id)

down:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) down $(id)

prune:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	@maketools/volmanager down

start:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) start $(flags) $(id)

stop:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) stop $(flags) $(id)

restart:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) restart $(flags) $(id)

pause:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) pause $(flags) $(id)

unpause:
	$(COMPOSE_CMD) -p $(NAME) -f $(COMPOSE_FILE) unpause $(flags) $(id)

# Docker rules |=====================================================
.PHONY: build run purge rmc rmi rmv rmn

run purge rmc rmi rmv rmn: middleware

run:
	bash maketools/docker-runner docker=$(DOCKER_CMD) img=$(img) name=$(name) env=$(env) envfile=$(envfile) rm=$(rm)

purge: rmc rmi rmv rmn

rmc:
ifneq ($(shell $(DOCKER_CMD) container ls -qa 2>/dev/null),)
	@printf "[${TXT_YELLOW}WARNING${TXT_NULL}] Cleaning containers...\n"
	$(DOCKER_CMD) stop $(shell $(DOCKER_CMD) container ls -qa)
	$(DOCKER_CMD) rm $(shell $(DOCKER_CMD) container ls -qa)
	@printf "[${TXT_GREEN}SUCCESS${TXT_NULL}] Containers has been cleanned...\n"
endif

rmi: rmc
ifneq ($(shell $(DOCKER_CMD) image ls -qa 2>/dev/null),)
	@printf "[${TXT_YELLOW}WARNING${TXT_NULL}] Deleting images...\n"
	$(DOCKER_CMD) rmi $(shell $(DOCKER_CMD) image ls -q)
	@printf "[${TXT_GREEN}SUCCESS${TXT_NULL}] Images has been deleted...\n"
endif

rmv: rmc
ifneq ($(shell $(DOCKER_CMD) volume ls -q 2>/dev/null),)
	@printf "[${TXT_YELLOW}WARNING${TXT_NULL}] Breaking volumes...\n"
	$(DOCKER_CMD) volume rm $(shell $(DOCKER_CMD) volume ls -q)
	@printf "[${TXT_GREEN}SUCCESS${TXT_NULL}] Volumes has been break...\n"
endif
	@maketools/volmanager down

rmn:
ifneq ($(shell $(DOCKER_CMD) network ls --filter type=custom -q 2>/dev/null),)
	@printf "[${TXT_YELLOW}WARNING${TXT_NULL}] Breaking networks...\n"
	docker network rm $(shell $(DOCKER_CMD) network ls --filter type=custom -q)
	@printf "[${TXT_GREEN}SUCCESS${TXT_NULL}] Networks has been break...\n"
endif

# Docker util rules |===========================================================
.PHONY: img imgall cont contall netall net vol debug debugall log plug help

img imgall cont contall net netall debug debugall log plug: middleware

img:
	@printf "/------------------|${TXT_YELLOW} DOCKER IMAGES ${TXT_NULL}|------------------\\ \n"
	$(DOCKER_CMD) image ls $(IMGLS_FLAG)

imgall: IMGLS_FLAG=-a

imgall: img

cont:
	@printf "/----------------|${TXT_GREEN} DOCKER CONTAINERS ${TXT_NULL}|----------------\\ \n"
	$(DOCKER_CMD) container ls $(CONTLS_FLAG)

contall: CONTLS_FLAG=-a

contall: cont

netall:
	@printf "/-----------------|${TXT_MAGENTA} DOCKER NETWORKS ${TXT_NULL}|-----------------\\ \n"
	$(DOCKER_CMD) network ls $(NETLS_FLAG)

net: NETLS_FLAG=--filter type=custom

net: netall

vol:
	@printf "/-----------------|${TXT_BLUE} DOCKER VOLUMES ${TXT_NULL}|------------------\\ \n"
	$(DOCKER_CMD) volume ls

ls: debug

debug: img contall net vol

lsa: debugall

debugall: imgall contall netall vol

log:
ifeq (,$(id))
	@echo "${TXT_RED}Error${TXT_NULL}: container id not found. Run 'make log id=<container_id>' or 'make help'"
	@exit 42
endif
	@printf "${TXT_YELLOW}--------------------------------------------------\\ ${TXT_NULL}\n"
	$(DOCKER_CMD) logs $(id) | awk '{ printf "${TXT_YELLOW}%-13s|${TXT_NULL} %s\n", "$(id)", $$LN ; }'
	@printf "${TXT_YELLOW}--------------------------------------------------/${TXT_NULL}\n"

plug:
ifeq (,$(id))
	@echo "${TXT_RED}Error${TXT_NULL}: container id not found. Run 'make plug id=<container_id>' or 'make help'"
	@exit 42
endif
	@printf "${TXT_YELLOW}--------------------------------------------------\\ ${TXT_NULL}\n"
	$(DOCKER_CMD) exec -it $(id) /bin/sh || echo -n
	@printf "${TXT_YELLOW}--------------------------------------------------/${TXT_NULL}\n"

help:
	@cat maketools/make.help
