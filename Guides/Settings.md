# Settings explained

The basic flow is **video -> detection -> filtering -> selection -> aim point -> movement -> output**. Each stage depends on the previous one. This reference explains the controls by function. Availability depends on the selected backend and hardware; use the controls available for your selected setup.

## Capture and performance

**Capture method** selects where pixels come from. **Capture width/height** define the captured region or source format. **Model input resolution** belongs to the detector and must match the model. Raising either dimension can increase processing cost; it does not automatically improve a poorly matched model.

An **FPS limit** caps processing/capture where supported. Unlimited is not necessarily smoother. Use the FPS and latency displays to find whether the bottleneck is source capture or inference before reducing dimensions or changing backends. Preview overlays help diagnose the pipeline but also add display work.

For network sources, check addresses, transport and ports on both ends. For capture cards, use a format the device actually supports. If a picture is corrupted, try a supported alternative format before touching detector settings.

## Detection

| Setting | Meaning | What to look for |
| --- | --- | --- |
| Backend / device | The inference implementation and compute device | Model loads and inference runs on a supported device |
| Model family | How the detector's output is interpreted | Correct box geometry and class count |
| Input resolution | The tensor size expected by the model | Compatibility with the exported model |
| Confidence | Discards boxes below a score | Too high misses weak targets; too low admits background detections |
| NMS threshold | Suppresses overlapping boxes | Lower usually suppresses overlaps more strongly; too much suppression can remove nearby distinct objects |
| Maximum detections | Limits retained boxes per frame | High enough for the scene without keeping unnecessary candidates |
| TRT precision | Engine computation precision, such as FP32/FP16 | Compare compatibility, accuracy and latency for the actual model/device |

Use the model's export information to choose its family and classes. A renamed extension cannot convert a model. A faster backend cannot supply missing trained weights.

## Parameter groups and activation keys

The selected group and selected key profile determine which settings you are editing. Check both before changing anything. Side Button 2, right-click and other bindings can have independent parameters. A top-level Auto Apply/Synced indicator is not a substitute for saving to disk.

Keep one known-working group before creating variations. Give new groups meaningful names and change one item at a time. After saving, reopen and verify that the intended group is active.

## Target selection and tracking

**Class filters** allow only the labels you intend to select. Their numbers come from your detector. **FOV** gates selection to an area of the preview; show that area while adjusting it. A strict gate may require a box center inside the region, while a relaxed gate may count a box edge, depending on the selected mode.

**Priority/scoring** decides which eligible detection wins. **Hold, switching and lost-target settings** influence whether selection stays on one object, changes quickly or waits through a short disappearance. If selection jumps between objects, first check allowed classes and the FOV region, then the switching controls.

**Dynamic FOV**, where available, changes the selection region after acquisition. Check the overlay to understand its effect rather than assuming a fixed visible radius applies in every state.

**Head/body fusion** links compatible head and body detections. It requires a detector that supplies those classes and the correct pairing. Incorrect mappings can cause vertical jumps or incorrect aim points. Leave it off if the model has only one relevant class or you do not know the pairing.

## Aim point

The aim point is a location within the selected rectangle. Ratio/offset controls move it relative to that box, not to an absolute screen coordinate. Use the preview marker to check the result on both large and small boxes; do not assume a ratio copied from another model points at the same feature.

Random aim-point options deliberately vary the point. Fixed-per-lock and periodically changing modes behave differently. A wider radius adds more movement variation and can reduce precision, especially on small boxes. Keep this disabled while diagnosing basic control.

## Movement control

X and Y controls can be adjusted independently. Keep the selected controller mode (such as Fast/Track) consistent while comparing changes.

| Control | Purpose | Typical sign it needs attention |
| --- | --- | --- |
| Speed / KP | How strongly movement responds to target error | Too weak trails behind; too strong overshoots or oscillates |
| Damping / KD | Reduces overshoot/change in movement | Excessive damping feels sluggish; too little can leave rebound |
| Prediction | Adds anticipation for moving targets | Too much can alternate ahead of and behind the target |
| Lock strength | Changes how tightly the chosen controller follows | Can interact with prediction and speed; avoid changing all at once |
| Deadzone | Ignores very small remaining errors | Too large stops short; too small may allow tiny corrections/jitter |

Tune speed on a simple stationary target first, then damping. Add prediction only after that and compare on a moving target. Add a small deadzone only if tiny corrections remain a problem. Record changes so you can return to the previous group. Use values appropriate for your device, sensitivity and model.

## Output and input masking

The **output method** sends the calculated movement. A valid detection and selected target can exist while output is disconnected or the wrong key is active. Check status and connection before changing movement gains.

**Axis/button masking** suppresses some physical input when supported by the chosen hardware. Capabilities differ by device. It is distinct from disabling movement on an axis and distinct from recoil/aim axis separation. Leave it off until ordinary output behaves as expected.

Keyboard/strafe/macro controls are separate optional actions. Leave them off during the initial setup and verify their own bindings before enabling them.

## Triggerbot / automatic firing

This acts when a target meets a trigger-zone condition. Use the zone preview to check its position and allowed classes. Zone size/shape, activation key and target eligibility come before timing adjustments.

**Delay** is the wait before firing, **random delay** adds timing variation, **hold duration** controls a press length, and **interval** controls repeated presses. Pulse/burst and continuous-hold modes differ. Automatic ADS adds another input action. Keep these features off while checking basic detection and output.

## Recoil compensation

The documented choices are a trajectory script or automatic downward compensation. A script must contain actual movement data: choose a valid profile with movement data.

Automatic mode has a base amount, optional increase over time/shots and limits/initial-shot overrides. Those values depend on the application, sensitivity and output path. Test recoil separately before combining it with tracking. Axis separation can assign recoil to Y and aim control to X, where supported, to reduce competing movement. Check conditions such as Require Target or Require ADS if it does not activate.

## Movement curves and QX data

Curves alter the movement path after basic control has been calculated. Sigma/Neural/off modes, curvature, tremor, overshoot and convergence options affect the path in different ways. Add these after the direct movement is stable. Turn them off again if they pull the path away from the intended point.

`App/qx_model_library` contains movement/prediction data. A `.cvmscurve` file is movement-curve data. Neither is an object detector.

## Crosshair color finder

This locates a crosshair using sampled colors or a color range. Use preview sampling rather than guessing a color. RGB tolerance or HSV ranges affect how broadly colors match; search area and minimum-pixel controls affect false matches. Too broad an area can include similar background colors. Confirm its marker follows the actual crosshair before using it as a reference for other actions.

## Small-target enhancement

This optional feature adds weak/small candidates using extra filtering/history. It cannot replace an appropriate detector or correct input resolution. If normal detections are already stable, leave it off. If enabling it introduces irrelevant boxes, revisit its area, confidence and matching-region controls.

## Anti-flash / turn-and-return actions

The documented function responds to a configured detection class and performs a turn followed by a return. It needs the correct class ID and functioning output. Timing, direction, movement scale and false-trigger filtering all affect the result. A detector with no such class cannot provide that trigger. Leave it off during baseline setup.

## Data collection and training

Data collection saves frames and associated labels for a separate dataset/training workflow. It does not improve the running detector automatically. Review generated labels before training, monitor disk use and turn collection off when finished.

A detector workflow is: collect/review images and labels -> train externally -> export a compatible detector -> load it in CVM. A movement-curve workflow produces movement data instead. Model packaging/encryption changes distribution/protection, not what the detector has learned.

## Authorization and protected models

The launcher does not supply model-specific authorization or decryption keys. Treat a protected-model compatibility/authorization error separately from video capture, model path and output connection errors.
