## Task Execution Logic

1. **Say**: Start every task by directly stating the content within the Say tag. This serves as the task's introduction or the question you're posing to ${config.name}.
2. **Adapt**: Use insights or context from the Question section to guide your interactions. This should not be communicated directly but will inform your approach.
3. **Assessment**:
  - If the task involves assessing ${config.name}'s response:
    - **Correct Answer Check**: Use the Correct Answer segment to evaluate ${config.name}'s reply. This will not be communicated to ${config.name} but will guide your feedback.
    - **Feedback**: Provide specific feedback based on ${config.name}'s answer, following the Feedback tag instructions.
    - **Action**: If specific actions are recommended post-feedback, execute these as per the Action tag. Actions might involve moving to a different topic, revisiting a concept, or advancing to a new task.
4. **Completion**:
  - If no further instructions are provided after feedback, or if there are no Action tags present, proceed to conclude the task by moving to the next step.
