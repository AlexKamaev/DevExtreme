import BaseMaskStrategy from './ui.text_editor.mask.strategy.base';

const DELETE_INPUT_TYPES = ['deleteContentBackward', 'deleteSoftLineBackward', 'deleteContent', 'deleteHardLineBackward'];
const HISTORY_INPUT_TYPES = ['historyUndo', 'historyRedo'];

class InputEventsMaskStrategy extends BaseMaskStrategy {
    _getStrategyName() {
        return 'inputEvents';
    }

    getHandleEventNames() {
        return [...super.getHandleEventNames(), 'beforeInput'];
    }

    _beforeInputHandler() {
        this._previousText = this.editor.option('text');
        this._prevCaret = this.editorCaret();
    }

    _inputHandler(event) {
        const { originalEvent } = event;
        if(!originalEvent) {
            return;
        }

        const { inputType, data } = originalEvent;
        const currentCaret = this.editorCaret();

        if(HISTORY_INPUT_TYPES.includes(inputType)) {
            this._updateEditorMask({
                start: currentCaret.start,
                length: currentCaret.end - currentCaret.start,
                text: ''
            });
            this.editorCaret(this._prevCaret);
        } else if(DELETE_INPUT_TYPES.includes(inputType)) {
            const length = (this._prevCaret.end - this._prevCaret.start) || 1;
            this.editor.setBackwardDirection();
            this._updateEditorMask({
                start: currentCaret.start,
                length,
                text: this._getEmptyString(length)
            });

            const beforeAdjustCaret = this.editorCaret();
            this.editor.setForwardDirection();
            this.editor._adjustCaret();
            const adjustedForwardCaret = this.editorCaret();
            if(adjustedForwardCaret.start !== beforeAdjustCaret.start) {
                this.editor.setBackwardDirection();
                this.editor._adjustCaret();
            }
        } else {
            if(!currentCaret.end) {
                return;
            }

            const length = (this._prevCaret?.end - this._prevCaret?.start) || 1;
            if(length > 1) {
                this.editor.setBackwardDirection();
                this._updateEditorMask({
                    start: currentCaret.start,
                    length,
                    text: this._getEmptyString(length)
                });
            }

            this._autoFillHandler(originalEvent);

            this.editorCaret(currentCaret);

            this.editor.setForwardDirection();
            const text = data ?? '';
            const hasValidChars = this._updateEditorMask({
                start: this._prevCaret?.start,
                length: text.length || 1,
                text
            });

            if(!hasValidChars) {
                this.editorCaret(this._prevCaret);
            }
        }

        if(this.editor.option('text') === this._previousText) {
            event.stopImmediatePropagation();
        }
    }

    _getEmptyString(length) {
        return Array(length + 1).join(' ');
    }

    _updateEditorMask(args) {
        const textLength = args.text.length;
        const updatedCharsCount = this.editor._handleChain(args);

        this.editor._displayMask();

        if(this.editor.isForwardDirection()) {
            const { start, end } = this.editorCaret();
            const correction = updatedCharsCount - textLength;

            if(updatedCharsCount > 1 && textLength === 1) {
                this.editorCaret({ start: start + correction, end: end + correction });
            }

            this.editor._adjustCaret();
        }

        return !!updatedCharsCount;
    }
}

export default InputEventsMaskStrategy;
