# 定义变量，用于存储检测到的包管理器
PACKAGE_MANAGER :=

# 检查 pnpm 是否可用
ifeq ($(shell which pnpm),)
# 如果 pnpm 不可用，检查 yarn 是否可用
    ifeq ($(shell which yarn),)
# 如果 yarn 也不可用，使用 npm
        PACKAGE_MANAGER := npm
    else
        PACKAGE_MANAGER := yarn
    endif
else
    PACKAGE_MANAGER := pnpm
endif

# install 规则，使用检测到的包管理器安装依赖
install:
	$(PACKAGE_MANAGER) install
dev:
	$(PACKAGE_MANAGER) dev