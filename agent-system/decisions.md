# Decisiones (Agent System)

## ADR-001: GitHub como fuente de verdad

- **Decisión**: La coordinación se implementa usando Issues/Labels/Milestones/Comments.
- **Motivo**: Evita duplicar herramientas y permite auditoría completa.
- **Consecuencia**: Las reglas de “routing” y “bloqueo” se expresan en labels (`agent:*`, `blocked`, `needs-attention`).

## ADR-002: Routing por label, asignación humana mínima

- **Decisión**: El agente responsable se registra como label `agent:<id>` y solo se fuerza assignee humano para `p0` sin dueño > 120 min.
- **Motivo**: GitHub no soporta asignar issues a agentes no-humanos; el label permite reflejar ownership y evitar P0 huérfanos.

## ADR-003: Métrica de 90% dentro del estimado como SLO monitoreado

- **Decisión**: Se mide `actual<=Estimate` usando ciclo de vida (created→closed) como proxy.
- **Motivo**: Es medible con datos disponibles y permite iteración. Si se requiere precisión, se agrega “Start/Done timestamps” explícitos.

