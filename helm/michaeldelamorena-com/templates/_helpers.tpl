{{/*
Expand the name of the chart.
*/}}
{{- define "michaeldelamorena-com.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "michaeldelamorena-com.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "michaeldelamorena-com.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{ include "michaeldelamorena-com.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "michaeldelamorena-com.selectorLabels" -}}
app.kubernetes.io/name: {{ include "michaeldelamorena-com.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
