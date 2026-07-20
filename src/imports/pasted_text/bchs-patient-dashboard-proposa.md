Executive Summary
Brant Community Healthcare System (BCHS) provides care to approximately 160,000 people across Brantford, Brant County, and Six Nations of the Grand River. The organization has a consistent record of strong clinical care, but stakeholder interviews, complaint data, and patient experience survey results point to a persistent gap in the surrounding experience, particularly within the Emergency Department (ED).
Patients moving through the ED often feel uncertain about their status, receive limited communication about what is happening next, struggle to navigate a large multi-wing campus, and encounter overcrowded waiting areas. Complaint data confirms this: the ED accounts for the largest share of hospital complaints, more than three times the next highest location, and communication is the single leading complaint category. These gaps add stress for patients and families, increase workload at the front desk, and quietly erode the benefit of BCHS's genuinely strong clinical performance.
To close this gap, we propose a patient-centric AI dashboard that automates key front-office functions and streamlines the parts of the patient experience that currently depend on manual staff effort and static signage. The dashboard is designed for mobile, desktop, and self-service kiosk use, and centers on four capabilities: real-time wayfinding, a live waiting room queue with wait-time estimates, patient status updates, and a virtual waiting room option for low-acuity patients.
The solution is intentionally designed to supplement, not replace, BCHS's existing technology. It integrates with the current MEDITECH environment through the established Summit Integration Engine, which limits disruption, protects BCHS's prior technology investment, and aligns with the Progress pillar of the organization's 2025 to 2030 strategic plan.
Given BCHS's financial constraints, we recommend a phased, pilot-first approach. The initial pilot, scoped to the ED, will be evaluated against clear performance indicators including patient satisfaction, waiting room congestion, communication effectiveness, and staff workload before any decision is made to expand the platform to additional departments or sites. This approach minimizes financial risk, supports organizational change management, and lets BCHS base future investment decisions on real pilot data rather than projection alone.
Implementation carries real but manageable risk, including cybersecurity exposure, uneven digital access across patient demographics, system implementation costs, and the inherent variability of wait-time estimates in emergency care. Each of these risks has a corresponding mitigation grounded in technical safeguards, PHIPA compliance, staff training, and a deliberately phased rollout.
In sum, the proposed AI patient dashboard offers BCHS a practical, cost-conscious, and scalable path to a materially better patient experience within existing budget and infrastructure constraints, while directly supporting the organization's strategic commitment to connected, equitable, and patient-centred care.
Partner Context and Challenge
About the Partner
Brant Community Healthcare System serves approximately 160,000 people across Brantford, Brant County, and Six Nations of the Grand River. Roughly 9 percent of the population it serves is Indigenous, a factor that meaningfully shapes how the organization approaches equity, access, and trust in every initiative it undertakes.
BCHS operates acute care, emergency, surgical, inpatient, and pediatric services, and functions as a regional stroke centre. The organization employs approximately 2,700 staff and 300 physicians, supported by a volunteer base drawn largely from seniors, students, and long-term community members. Its main site, Brantford General Hospital, is a multi-wing campus spanning A, B, C, D, E, and H wings across multiple levels, including sub-levels, a physical layout that itself contributes to the navigation difficulties patients report.
BCHS is guided by its Leading Beyond Care 2025 to 2030 strategic plan, built on four pillars: Patients, People, Partners, and Progress, and four core values: Be Bold and Courageous, Commit to Excellence, Champion Equity, and Be Trustworthy. The Progress pillar commits the organization to a digital health strategy and, over time, a modernized health information system, a commitment this initiative directly supports.
The Operating Environment
Financial limitations are the binding constraint on any technology investment at BCHS. Provincial funding covers day-to-day operations and drugs, but capital funding is allocated separately and competes for a limited annual allotment. BCHS has been explicit in stakeholder discussions that full modernization is blocked by financing, not by organizational willingness. For this engagement, the working budget is $50,000, with a hard ceiling of $200,000.
The organization's core clinical technology has become outdated, though its underlying infrastructure remains a stable foundation to build on. BCHS runs MEDITECH version 5.67 as its electronic health record system, a release the organization itself describes as behind where it wants to be. Even so, the application integration diagram shows a well-established integration layer: the Summit Integration Engine routes HL7 messages and ADT (Admit, Discharge, and Transfer) data to a wide range of internal applications and provincial systems. The IT team consists of 14 staff plus two managers, covering cybersecurity, networking, EHR, integrations, and ongoing improvement work.
What BCHS Asked For
Across two consultation sessions with Eric Morrison (Director, IT Operations and CTO), Alena Lukich (Vice President, Strategy, Quality, Risk and Communications), and Michael Marini (Manager, Communications and Public Affairs), BCHS identified three priorities:
●	Improve the ED waiting experience and patient flow. Time from arrival to clinician has improved but not enough, and initial physician assessment time is directly tied to provincial funding.
●	Help patients understand their journey. Patients and families need a way to understand where they are in the care process and where their loved one is, to reduce anxiety during the visit.
●	Fix wayfinding. Navigating the hospital is difficult due to the number of wings and the limitations of current signage. Patients need clearer, more accessible direction throughout the facility.
What BCHS Is Looking For
Privacy and security are a stated priority for BCHS. PHIPA compliance is mandatory, and patient information cannot be publicly exposed under any circumstances. The solution must also support interoperability, meaning information captured at BCHS should remain usable across a patient's other healthcare touchpoints. On accessibility and equity, BCHS serves patients across all demographics, ages, languages, abilities, and levels of technology access, and any solution must be designed with that full range of users in mind. Any implementation must also work from a change management perspective, fitting naturally into existing physician and staff workflows rather than adding friction.
BCHS performs well on the quality of care it delivers, with patient ratings at or near provincial benchmarks across most service lines. The opportunity lies specifically in the experience that surrounds that care: helping patients navigate the facility and keeping them informed while they wait. The challenge for this engagement was to strengthen that experience within BCHS's existing budget and infrastructure constraints, without replacing the systems already in place.
Problem Identification and Root Cause Analysis
Three evidence sources informed this analysis: complaint data, BCHS Patient Experience Survey data, and stakeholder interviews, supported by the Brantford General Hospital floor directory, a technology stack overview, and the application integration diagram.
What the Evidence Shows
Evidence Source	Key Finding
Complaint data	The Emergency Department is the single largest source of complaints at 28.6 percent of the total, more than three times the next highest location.
Complaint category	Communication is the leading complaint category, at 26.6 percent of all complaints.
Patient Experience Survey	The ED is the lowest-rated service line, with a 68 percent top-box score (patients rating their experience 8, 9, or 10 out of 10).

Taken together, this evidence points to a consistent pattern: BCHS delivers care that patients rate well once they receive it, but the surrounding experience of waiting, navigating, and staying informed is where the organization is losing the most ground with patients and families.
Problem Statement
Problem Statement
How might we improve the patient experience so that patients and families feel well informed and less anxious throughout their hospital journey, while also enhancing BCHS's real-time visibility for managing high-density periods?
Solution Design and Prototype
The proposed solution is a patient-facing AI dashboard that digitizes and centralizes the front-end patient experience within the BCHS Emergency Department. The platform is device-agnostic, deployable across mobile phones, desktop browsers, and self-service kiosks placed throughout the ED and main hospital wings. Rather than replacing MEDITECH or the Summit Integration Engine, the dashboard sits as a lightweight, interoperable layer on top of existing infrastructure, drawing on ADT and HL7 data feeds to populate patient-relevant information in real time.
Core Dashboard Functions
Real-Time Wayfinding
An interactive hospital map guides patients and visitors through Brantford General Hospital's multi-wing campus. Users can search for a department or clinician and receive turn-by-turn directions, reducing confusion, missed appointments, and the volume of navigation-related questions directed at front-desk staff.
Waiting Room Queue and Wait-Time Estimates
Patients receive a queue position and a dynamically updated estimated wait time based on triage acuity and current ED volume. Clear instructions indicate where to wait, when to return, and what to do if their condition changes, directly addressing communication, the top complaint category identified in the survey data.
Patient Status Updates
Once triaged, patients and approved family members receive real-time, plain-language status notifications, for example that an assessment is complete and the patient is now waiting for a physician, or that lab results are being processed. This reduces anxiety and lowers the volume of status inquiries directed at nursing and clerical staff.
Virtual Waiting Room for Low-Acuity Patients
Eligible low-priority patients, corresponding to CTAS levels IV and V, may complete registration remotely and wait off-site, receiving a notification when their care space is ready. This reduces physical waiting room density and gives BCHS a live signal of incoming patient volume before individuals are called back, directly supporting congestion management during high-density periods.
Design Principles
●	Non-disruptive integration: built to interoperate with MEDITECH 5.67 via the existing Summit Integration Engine, avoiding the cost and risk of a full EHR overhaul.
●	PHIPA-first architecture: role-based access control, encryption in transit and at rest, and secure authentication are foundational requirements, not later additions.
●	Accessibility by design: multi-platform availability across kiosk, mobile, and desktop ensures patients without smartphones or digital confidence are not excluded, with front desk staff remaining available as a fallback at all times.
●	Cultural and linguistic responsiveness: given that Indigenous patients make up roughly 9 percent of the population served, the interface supports multilingual content and will be developed with input from community partners to build trust and ensure equitable use.
Prototype and Design Deliverables
The prototype was developed using Figma Make for interactive interface design across mobile, desktop, and kiosk form factors, with supporting visual assets refined in Adobe Creative Suite to align with BCHS's visual identity. Final deliverables, including flow diagrams, screen mockups, and this business case, were compiled into a PowerPoint presentation for executive review, allowing leadership to walk through the patient journey from arrival to discharge alongside each proposed dashboard touchpoint.
Deliverable	Location and Notes
Wayfinding screen	Figma Make prototype. Link to be inserted upon finalization.
Queue and wait-time screen	Figma Make prototype. Link to be inserted upon finalization.
Patient status update screen	Figma Make prototype. Link to be inserted upon finalization.
Virtual waiting room registration screen	Figma Make prototype. Link to be inserted upon finalization.
Executive presentation	Accompanying PowerPoint deck, included with this report.
Implementation Roadmap
Given BCHS's cost constraints, we recommend a multi-year, phased approach that begins with a pilot in the Emergency Department. After analyzing core performance indicators, including satisfaction, waiting room congestion, communication effectiveness, and staff workload, the dashboard can be refined and then extended to additional departments and hospital sites. This approach minimizes financial risk, supports organizational change management, and allows BCHS to base future decisions on real pilot data as the rollout proceeds.
Phase 1: Pilot, Months 0 to 4, Emergency Department Only
●	Deploy the dashboard on a limited number of kiosks in the ED waiting room, plus mobile and web access.
●	Integrate wayfinding, queue status, and wait-time estimates first, as these require the least complex data integration.
●	Train front desk and triage staff on system use and patient support.
●	Establish baseline metrics for patient satisfaction, waiting room density, front-desk inquiry volume, and communication-related complaints.
Phase 2: Iteration and Expansion of Features, Months 4 to 8
●	Introduce virtual waiting room functionality for CTAS IV and V patients, once core dashboard stability has been validated.
●	Refine wait-time estimation using real pilot data to improve accuracy.
●	Incorporate patient and staff feedback collected during Phase 1 into interface and workflow adjustments.
●	Begin a PHIPA compliance audit and third-party security review ahead of broader rollout.
Phase 3: Hospital-Wide and Multi-Site Scaling, Months 8 Onward
●	Extend wayfinding and status-update functionality beyond the ED to other departments, including inpatient units and diagnostic imaging.
●	Evaluate feasibility of extending the platform to other BCHS sites.
●	Use accumulated performance data to build the business case for deeper EMR integration as part of BCHS's longer-term digital health strategy.
Governance and Change Management
A joint steering committee, drawing on IT Operations, Strategy and Quality, Communications, and ED clinical leadership, will oversee each phase gate, ensuring that pilot performance indicators are met before additional investment or scope expansion is approved. This phased-gate structure keeps financial exposure within the working budget during Phase 1 and defers larger capital commitments until value has been demonstrated.
Risks, Limitations, and Mitigation Strategies
Risk	Mitigation
Digital access gap: the dashboard may be difficult to use for older adults and patients with limited digital skills.	Provide the system on multiple platforms, including self-service kiosks, and keep front desk staff available to support patients who need help.
Data privacy and security: integration with hospital systems and display of patient details creates exposure risk.	Implement encryption, secure user authentication, role-based access controls, and full adherence to the Personal Health Information Protection Act (PHIPA).
Wait-time accuracy: estimated wait times may vary because emergency care volume is inherently unpredictable.	Update and communicate wait times in real time and explicitly as estimates, adjusted for acuity and current hospital capacity, to manage patient expectations.
Financial and training burden: implementation requires investment and staff onboarding time.	Use a phased pilot to test system performance, collect user feedback, and refine the platform before wider integration, supported by full staff training and ongoing technical assistance.

Recognizing these risks up front allows BCHS to plan appropriate mitigation strategies and maximize the effectiveness of the proposed solution, while managing the challenges inherent to any new technology implementation in a clinical setting.
Conclusion and Recommendations
BCHS delivers strong clinical outcomes, but patient experience data consistently points to the same gap: patients and families feel uninformed, disoriented, and anxious while navigating the hospital, a gap concentrated most heavily in the Emergency Department, which accounts for the largest share of complaints and the lowest patient experience scores in the system.
The proposed AI-powered patient dashboard directly targets this gap without requiring BCHS to replace its core technology stack. By layering wayfinding, real-time status updates, wait-time transparency, and a virtual waiting room on top of existing MEDITECH and Summit Integration Engine infrastructure, the solution respects BCHS's financial constraints while still delivering a modern, patient-centred experience.
We recommend that BCHS:
1.	Approve a Phase 1 pilot in the Emergency Department, scoped to the $50,000 working budget, focused on wayfinding, queue visibility, and status updates.
2.	Establish clear success metrics up front, including patient satisfaction, waiting room congestion, communication complaint volume, and front-desk workload, to objectively evaluate the pilot before further investment.
3.	Prioritize PHIPA compliance and accessibility from day one, ensuring the solution serves BCHS's full patient population, including older adults, patients with limited digital literacy, and Indigenous community members.
4.	Treat the dashboard as a scalable platform, not a point solution, one that can extend to additional departments and eventually support BCHS's broader digital health modernization goals under the Progress pillar of its 2025 to 2030 strategic plan.

This approach allows BCHS to make meaningful, measurable progress on patient experience today, while building the evidence base and infrastructure needed to support larger digital investments in the future, without disrupting current clinical operations or exceeding budget constraints.
