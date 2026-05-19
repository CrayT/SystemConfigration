> 将前端编译产物部署到服务器，用docker容器托管，容器内serve起web服务

```shell
#!/bin/bash

set -e

SCRIPT_DIR=$(cd $(dirname $(readlink -f $0)); pwd)
REPO_ROOT=$(cd ${SCRIPT_DIR}; git rev-parse --show-toplevel)

echo "SCRIPT_DIR: $SCRIPT_DIR"
echo "REPO_ROOT: $REPO_ROOT"

IMAGE_NAME="xxxx"
VERSION="$(date +%Y%m%d%H%M)"

# rewrite .env.replay and Dockerfile
echo -e "PUBLIC_URL=/xxx/\nREACT_APP_BASEURL=/xxx/" > ${SCRIPT_DIR}/.env.dev

echo -e "
FROM node:16.20.2-alpine3.18 as ss

WORKDIR /build

COPY build /build/xxx/
RUN npm install -g serve && mv xxx/index.html .

# serve with index.html
CMD [\"sh\", \"-c\", \"serve -s .\"]
" > ${SCRIPT_DIR}/Dockerfile

echo "-----"

function usageMsg() {
cat << HELP
$(basename $0) -- Build web frontend ui docker image.

Usage:
    $(basename $0) {[-h|--help]} {-v|--version version}

Options:
    -h, --help                      Print this help message.
    -v VERSION, --version VERSION   Specify the tag of docker image.
HELP
}

TEMP=$(getopt -o hv: --long help,version: -n "$(basename $0)" -- "$@")
eval set -- "$TEMP"

while true; do
    case "$1" in
        -h|--help)
            usageMsg
            exit 0
            ;;
        -v|--version)
            VERSION=$2
            shift 2
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Internal error!"
            exit 1
            ;;
    esac
done

# Check parameters
if [ "x$VERSION" = "x" ]; then
    echo "Must specify VERSION with -v or --version"
    exit 1
fi

IMAGE="${IMAGE_NAME}:${VERSION}"
echo "VERSION:  $VERSION"
echo "IMAGE  :  ${IMAGE}"

# 提高node内存限制
export NODE_OPTIONS="--max-old-space-size=8192"

# pls change the host name every time change dns
sed -i "1 i HOST=registry.hubhost.com" ${REPO_ROOT}/frontend/.env

echo "----start install---"
yarn install
echo "----install success---"

echo "----start build docker---"
yarn build_docker
# package内的命令为："build_docker": "CI='' dotenv -e .env.replay react-app-rewired build"
docker build -t ${IMAGE} `pwd`

echo "----build docker success---"

```

> 构建的镜像启动的容器，默认会启动serve支持的web服务，关于serve使用，参考 `node端服务` 篇章。