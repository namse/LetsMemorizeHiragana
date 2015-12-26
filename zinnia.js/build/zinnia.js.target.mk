# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := zinnia.js
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=zinnia.js' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Debug := \
	-I/home/ubuntu/.node-gyp/4.1.1/include/node \
	-I/home/ubuntu/.node-gyp/4.1.1/src \
	-I/home/ubuntu/.node-gyp/4.1.1/deps/uv/include \
	-I/home/ubuntu/.node-gyp/4.1.1/deps/v8/include \
	-I$(srcdir)/zinnia/zinnia

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=zinnia.js' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-O3 \
	-ffunction-sections \
	-fdata-sections \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Release := \
	-I/home/ubuntu/.node-gyp/4.1.1/include/node \
	-I/home/ubuntu/.node-gyp/4.1.1/src \
	-I/home/ubuntu/.node-gyp/4.1.1/deps/uv/include \
	-I/home/ubuntu/.node-gyp/4.1.1/deps/v8/include \
	-I$(srcdir)/zinnia/zinnia

OBJS := \
	$(obj).target/$(TARGET)/zinnia.js.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS := \
	-Wl,-rpath,/usr/local/lib/ \
	/usr/local/lib/libzinnia.so

$(obj).target/zinnia.js.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/zinnia.js.node: LIBS := $(LIBS)
$(obj).target/zinnia.js.node: TOOLSET := $(TOOLSET)
$(obj).target/zinnia.js.node: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/zinnia.js.node
# Add target alias
.PHONY: zinnia.js
zinnia.js: $(builddir)/zinnia.js.node

# Copy this to the executable output path.
$(builddir)/zinnia.js.node: TOOLSET := $(TOOLSET)
$(builddir)/zinnia.js.node: $(obj).target/zinnia.js.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/zinnia.js.node
# Short alias for building this executable.
.PHONY: zinnia.js.node
zinnia.js.node: $(obj).target/zinnia.js.node $(builddir)/zinnia.js.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/zinnia.js.node

