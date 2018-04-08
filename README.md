# vscode-emacs-friendly

This plugin provides emacs keybindings and workflow for Visual Studio Code and is a fork of the great vscode extension by [hiro-sun](https://github.com/hiro-sun/vscode-emacs).

It merges some of the pull requests in the original and other external helpers that make the extension a little less an exact copy of emacs behavior, and a little more friendly in interacting with the system clipboard and normal vscode interactions.

The following are some of the changes and enhancements from the original:

* The clipboard handling is simplified by the removal of the emacs-only kill ring (which was also an unfinished implementation in the original). Copy, Cut, Yank and C-K work with the system clipboard now.
* C+x k to close tab, C+x C-k all tabs
* C+l centers screen on the cursor line
* C+x C+f bound to quick open file
* yank overwrites selection


### Move commands
|Command | Desc |
|--------|------|
| `C-f` | Move forward |
| `C-b` | Move backward |
| `C-n` | Move to the next line |
| `C-p` | Move to the previous line |
| `C-a` | Move to the beginning of line |
| `C-e` | Move to the end of line |
| `M-f` | Move forward by one word unit |
| `M-b` | Move backward by one word unit |
| `M->` | Move to the end of buffer |
| `M-<` | Move to the beginning of buffer |
| `C-v` | Scroll down by one screen unit |
| `M-v` | Scroll up by one screen unit |
| `M-g g` | Jump to line (command palette) |
| `M-g n` | Jump to next error |
| `M-g p` | Jump to previous error |
| `C-l` |  Center screen on current line |


### Search Commands
|Command | Desc |
|--------|------|
| `C-s` | Search forward |
| `C-r` | Search backward |
| `A-%` | Replace |
| `C-Enter` | Replace One Match (In replace dialog) |
| `C-M-n` | Add selection to next find match |


### Edit commands
|Command | Desc |
|--------|------|
| `C-d` | Delete right (DEL) |
| `C-h` | Delete left (BACKSPACE) |
| `M-d` | Delete word |
| `M-Bksp` | Delete word left |
| `C-k` | Kill to line end |
| `C-S-Bksp` | Kill entire line |
| `C-w` | Kill region |
| `M-w` | Copy region to kill ring |
| `C-y` | Yank |
| `C-j` | Enter |
| `C-m` | Enter |
| `C-x C-o` | Delete blank lines around |
| `C-x h` | Select All |
| `C-x u` (`C-/`)| Undo |
| `C-;` | Toggle line comment in and out |
| `M-;` | Toggle region comment in and out |
| `C-x C-l` | Convert to lower case |
| `C-x C-u` | Convert to upper case |

### Other Commands
|Command | Desc |
|--------|------|
| `C-g` | Cancel |
| `C-space` | Set mark |
| `C-quote` | IntelliSense Suggestion |
| `M-x` | Open command palette |
| `C-M-SPC` | Toggle SideBar visibility |
| `C-x z` | | Toggle Zen Mode |

### File Commands
|Command | Desc |
|--------|------|
| `C-x C-s` | Save |
| `C-x C-w` | Save as |
| `C-x C-n` | Open new window |

### Tab / Buffer Manipulation Commands
|Command | Desc |
|--------|------|
| `C-x b` | Switch to another open buffer |
| `C-x C-f` | QuickOpen a file |
| `C-x k` | Close current tab (buffer) |
| `C-x C-k` | Close all tabs |
| `C-x 1` | Close editors in other (split) group.  |
| `C-x 2` | Split editor |
| `C-x 3` | Toggle split layout (vertical to horizontal) |
| `C-x o` | Focus other split editor |

## Conflicts with default key bindings
- `ctrl+d`: editor.action.addSelectionToNextFindMatch => **Use `ctrl+alt+n` instead**;
- `ctrl+g`: workbench.action.gotoLine => **Use `alt+g g` instead**;
- `ctrl+b`: workbench.action.toggleSidebarVisibility => **Use `ctrl+alt+space` instead**;
- `ctrl+space`: toggleSuggestionDetails, editor.action.triggerSuggest => **Use `ctrl+'` instead**;
- `ctrl+x`: editor.action.clipboardCutAction => **Use `ctrl+w` instead**;
- `ctrl+v`: editor.action.clipboardPasteAction => **Use `ctrl+y` instead**;
- `ctrl+k`: editor.debug.action.showDebugHover, editor.action.trimTrailingWhitespace, editor.action.showHover, editor.action.removeCommentLine, editor.action.addCommentLine, editor.action.openDeclarationToTheSide;
- `ctrl+k z`: workbench.action.toggleZenMode => **Use `ctrl+x z` instead**;
- `ctrl+y`: redo;
- `ctrl+m`: editor.action.toggleTabFocusMode;
- `ctrl+/`: editor.action.commentLine => **Use `ctrl+;` instead**;
- `ctrl+p` & `ctrl+e`: workbench.action.quickOpen => **Use `ctrl+x b` instead**;
- `ctrl+p`: workbench.action.quickOpenNavigateNext => **Use `ctrl+n` instead**.

# More information

The logo is from the great [Pacifica Icon Set](http://bokehlicia.deviantart.com/art/Pacifica-Icons-402508559).
