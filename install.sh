#!/bin/bash

help_generate()
{
	bin=${1:-"install.sh"}
	help="usage: ./0 [<project>]\n"
	help+="If you don't set a project as argument, we'll ask you a project in STDIN.\n\n"
	help+="PROJECTS\n"

	help+="\tRank 0:\t"
	help+="\tlibft\n"

	help+="\tRank I:\t"
	help+="\tft_printf "
	help+="- get_next_line "
	help+="- born2beroot\n"

	help+="\tRank II:\t"
	help+="pipex "
	help+="- minitalk "
	help+="- push_swap "
	help+="- so_long "
	help+="- fract-ol "
	help+="- fdf\n"

	help+="\tRank III:\t"
	help+="philosophers "
	help+="- minishell\n"

	help+="\tRank IV:\t"
	help+="cub3d "
	help+="- minirt "
	help+="- netpractice "
	help+="- cpp\n"

	help+="\tRank V:\t"
	help+="\tinception "
	help+="- webserv "
	help+="- ft_containers "
	help+="- ft_irc\n"

	help+="\tRank VI:\t"
	help+="ft_transcendence\n"

	echo -e "$help"
}


if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
	help_generate
	exit 0
fi

id=
title=

if [ -n "$1" ]; then
	REPLY="$1"
else
	read -p "Which project: "
fi

case "$REPLY" in
	"libft")
		id="libft"
		title="Libft"
		;;
	"ft_printf")
		id="ft_printf"
		title="FT Printf"
		;;
	"get_next_line")
		id="get_next_line"
		title="Get Next Line"
		;;
	"born2beroot")
		id="born2beroot"
		title="Born 2 Be Root"
		;;
	"pipex")
		id="pipex"
		title="Pipex"
		;;
	"minitalk")
		id="minitalk"
		title="Minitalk"
		;;
	"push_swap")
		id="push_swap"
		title="Push Swap"
		;;
	"so_long")
		id="so_long"
		title="So Long"
		;;
	"fract-ol")
		id="frac-ol"
		title="Fract-Ol"
		;;
	"fdf")
		id="fdf"
		title="FdF"
		;;
	"philosophers")
		id="philosophers"
		title="Philosophers"
		;;
	"minishell")
		id="minishell"
		title="Minishell"
		;;
	"minirt")
		id="minirt"
		title="Mini-RT"
		;;
	"cub3d")
		id="cub3d"
		title="Cub3D"
		;;
	"netpractice")
		id="netractice"
		title="Netpractice"
		;;
	"cpp")
		id="cpp"
		title="CPP"
		;;
	"inception")
		id="inception"
		title="Inception"
		;;
	"webserv")
		id="webserv"
		title="Webserv"
		;;
	"ft_containers")
		id="ft_containers"
		title="FT Containers"
		;;
	"ft_irc")
		id="ft_irc"
		title="FT Irc"
		;;
	"ft_transcendence")
		id="ft_transcendence"
		title="FT Transcendence"
		;;
	*)
		: ${project_id:?"Project not found"}
		;;
esac

# Extrair e realocar recursos
tar -xf .src/${id}.tar.gz
mkdir assets srcs
mv ${id}/subject assets
mv ${id}/header/* .github/img/

echo "Develop project here" > assets/eraseme.md

sed -i "s/42template_light.png/${id}_light.svg/g" $(find . -type f -name "*.md")
sed -i "s/42template_dark.png/${id}_dark.svg/g" $(find . -type f -name "*.md")
sed -i "s/42template/${id}/g" $(find . -type f -name "*.md")
sed -i "s/42Template/${title}/g" $(find . -type f -name "*.md")

rm .github/img/42template*.png
rm -rf ${id} .src
rm install.sh