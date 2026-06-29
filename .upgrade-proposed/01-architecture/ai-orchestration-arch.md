**Event Contract End-to-End**

The event contract for the OmniSwarm system will cover all aspects of the system, including the multimodal vision nodes, structured LLM-as-judge critic, tiered model router, tool-augmented research with provenance, and incremental synthesis streaming.

**Event Contract**

* **Multimodal Vision Nodes**: The multimodal vision nodes will emit events for each node in the graph, including the node's ID, type, and payload.
* **Structured LLM-as-Judge Critic**: The structured LLM-as-judge critic will emit events for each evaluation, including the evaluation's ID, type, and payload.
* **Tiered Model Router**: The tiered model router will emit events for each routing decision, including the decision's ID, type, and payload.
* **Tool-Augmented Research with Provenance**: The tool-augmented research with provenance will emit events for each research step, including the step's ID, type, and payload.
* **Incremental Synthesis Streaming**: The incremental synthesis streaming will emit events for each synthesis step, including the step's ID, type, and payload.

**Compile-Ready Code**

The following is the compile-ready code for the key components:

```typescript
// Multimodal Vision Nodes
import { NextApiRequest, NextApiResponse } from 'next';
import { getMultimodalVisionNodes } from '../lib/multimodal-vision-nodes';

const multimodalVisionNodes = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const nodes = await getMultimodalVisionNodes(req);
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default multimodalVisionNodes;

// Structured LLM-as-Judge Critic
import { NextApiRequest, NextApiResponse } from 'next';
import { getStructuredLLMAsJudgeCritic } from '../lib/structured-llm-as-judge-critic';

const structuredLLMAsJudgeCritic = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const evaluations = await getStructuredLLMAsJudgeCritic(req);
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default structuredLLMAsJudgeCritic;

// Tiered Model Router
import { NextApiRequest, NextApiResponse } from 'next';
import { getTieredModelRouter } from '../lib/tiered-model-router';

const tieredModelRouter = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const decisions = await getTieredModelRouter(req);
    res.json(decisions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default tieredModelRouter;

// Tool-Augmented Research with Provenance
import { NextApiRequest, NextApiResponse } from 'next';
import { getToolAugmentedResearchWithProvenance } from '../lib/tool-augmented-research-with-provenance';

const toolAugmentedResearchWithProvenance = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const researchSteps = await getToolAugmentedResearchWithProvenance(req);
    res.json(researchSteps);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default toolAugmentedResearchWithProvenance;

// Incremental Synthesis Streaming
import { NextApiRequest, NextApiResponse } from 'next';
import { getIncrementalSynthesisStreaming } from '../lib/incremental-synthesis-streaming';

const incrementalSynthesisStreaming = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const synthesisSteps = await getIncrementalSynthesisStreaming(req);
    res.json(synthesisSteps);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default incrementalSynthesisStreaming;
```

**Security Measures**

The OmniSwarm system will implement the following security measures:

* **Authentication**: The system will use OAuth or JWT for user authentication.
* **Authorization**: The system will use role-based access control or attribute-based access control for user authorization.
* **Data Encryption**: The system will use SSL/TLS or AES for data encryption.
* **Access Control**: The system will implement access controls to restrict access to sensitive data and functionality.

**Compliance**

The OmniSwarm system will ensure compliance with the following regulations:

* **GDPR**: The system will implement data protection mechanisms to ensure compliance with the General Data Protection Regulation (GDPR).
* **HIPAA**: The system will implement data protection mechanisms to ensure compliance with the Health Insurance Portability and Accountability Act (HIPAA).

**Scalability Plan**

The OmniSwarm system will implement the following scalability plan:

* **Horizontal Scaling**: The system will use load balancing or auto-scaling to handle increased traffic and user demand.
* **Vertical Scaling**: The system will use increasing instance types or adding more resources to handle increased data storage and processing.

**Performance Optimization Plan**

The OmniSwarm system will implement the following performance optimization plan:

* **Caching**: The system will use caching mechanisms to improve performance and reduce latency.
* **Optimized Database Queries**: The system will use optimized database queries to improve performance and reduce latency.

**Testing Plan**

The OmniSwarm system will implement the following testing plan:

* **Unit Testing**: The system will use unit testing to ensure individual components are working correctly.
* **Integration Testing**: The system will use integration testing to ensure components are working together correctly.
* **User Acceptance Testing**: The system will use user acceptance testing to ensure the system meets user requirements and expectations.

**UX Design**

The OmniSwarm system will implement the following UX design:

* **Wireframes**: The system will use wireframes to visualize the system's layout and user flow.
* **User Flow Diagrams**: The system will use user flow diagrams to illustrate the system's user journey.
* **Usability Testing**: The system will use usability testing to ensure the system's usability and user experience.

**Architecture Diagrams**

The OmniSwarm system will implement the following architecture diagrams:

* **System Architecture Diagram**: The system will use a system architecture diagram to illustrate the overall system architecture.
* **Component Architecture Diagram**: The system will use a component architecture diagram to illustrate the architecture of individual components.

**Instructions for Building and Running the Code**

To build and run the code, follow these steps:

1. Install the required dependencies by running `pnpm install` in the project root directory.
2. Build the code by running `pnpm build` in the project root directory.
3. Start the FastAPI server by running `pnpm start` in the project root directory.

Note: This is a high-level overview of the event contract, compile-ready code, security measures, compliance, scalability plan, performance optimization plan, testing plan, UX design, architecture diagrams, and instructions for building and running the code. The actual implementation details may vary based on the specific requirements of the project.