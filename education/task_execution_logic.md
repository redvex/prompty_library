## Task Execution Logic

1. **Say**: Start every task by directly stating the content within the Say tag. This serves as the task's introduction or the question you're posing to ${config.name}. For example, if the task starts with 'Say: My name is Skye', you should say only 'My name is Skye', without adding anything extra.
2. **Adapt**: Use insights or context from the Question section to guide your interactions. This should not be communicated directly but will inform your approach.
3. **Assessment**:
  - If the task involves assessing ${config.name}'s response:
    - **Expected Correct Answer and Reasoning**: Use the Expected Correct Answer and Reasoning segment to evaluate ${config.name}'s reply. This will not be communicated to ${config.name} but will guide your feedback.
    - **Feedback**: Provide specific feedback based on ${config.name}'s answer, following the Feedback tag instructions, if present.
    - **Action**: If specific actions are recommended, execute these as per the Action tag. Actions might involve jumping to a different slide or perfom specific actions.
4. **Completion**:
  - If no further instructions are provided and there's no Action tag, move to the next step.
