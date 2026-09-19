import { useState } from 'react';
import {
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Mail,
  CalendarDays,
  Plus,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import Dropdown, { DropdownItem, DropdownCaption, DropdownDivider } from '../components/ui/Dropdown.jsx';
import Progress, { ProgressIndeterminate } from '../components/ui/Progress.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Skeleton, { SkeletonLines, PageLoading } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Avatar from '../components/ui/Avatar.jsx';

function SectionHead({ title, children }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default function UIKit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [errorRetries, setErrorRetries] = useState(0);
  const [recovered, setRecovered] = useState(false);

  const handleRetry = () => {
    setRecovered(false);
    setErrorRetries((count) => count + 1);
    window.setTimeout(() => setRecovered(true), 500);
  };

  return (
    <div className="uikit">
      <div className="uikit-hero">
        <span className="eyebrow">Design system</span>
        <h1>UI Kit</h1>
        <p className="muted">
          The reusable building blocks of LifeOS — calm, warm and quietly premium.
        </p>
      </div>

      {/* ---- Buttons ---- */}
      <section className="section">
        <SectionHead title="Buttons">
          Three tones, four sizes, loading and disabled states.
        </SectionHead>
        <div className="demo-pad">
          <span className="demo-label">Variants</span>
          <div className="demo-row">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="secondary">Soft green</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <span className="demo-label">Sizes & icons</span>
          <div className="demo-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="sm" leftIcon={Plus}>Add task</Button>
            <Button size="icon" aria-label="Add">
              <Plus size={18} />
            </Button>
          </div>
          <span className="demo-label">States</span>
          <div className="demo-row">
            <Button loading>Submitting</Button>
            <Button variant="outline" leftIcon={Bell}>Notify</Button>
            <Button disabled>Disabled</Button>
            <Button variant="ghost" disabled>Disabled ghost</Button>
          </div>
        </div>
      </section>

      {/* ---- Inputs ---- */}
      <section className="section">
        <SectionHead title="Inputs">Field family with labels, hints and validation.</SectionHead>
        <div className="demo-pad">
          <div className="demo-grid">
            <div className="demo-col">
              <span className="demo-label">Text</span>
              <Input label="Full name" placeholder="Mahnoor Imran" />
              <Input label="Email address" placeholder="you@university.edu" type="email" icon={Mail} />
              <Input label="Search" placeholder="Find anything…" type="search" icon={Search} />
            </div>
            <div className="demo-col">
              <span className="demo-label">Hint & optional</span>
              <Input
                label="Study hours per week"
                hint="We'll keep this private — used only for your own analytics."
                type="number"
                optional
                placeholder="e.g. 20"
              />
              <Input label="Password" type="password" placeholder="At least 8 characters" />
              <Input
                label="Due date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="demo-col">
              <span className="demo-label">Error & disabled</span>
              <Input
                label="Email address"
                placeholder="you@university.edu"
                defaultValue="not-an-email"
                error="Please enter a valid email address."
              />
              <Input label="Disabled field" placeholder="Locked" disabled value="Read only" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Select & Textarea ---- */}
      <section className="section">
        <SectionHead title="Selects & text areas">Native-backed, fully styled.</SectionHead>
        <div className="demo-pad">
          <div className="demo-grid-2">
            <div className="demo-col">
              <span className="demo-label">Select</span>
              <Select label="Semester" defaultValue="">
                <option value="" disabled>
                  Choose a semester…
                </option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
              </Select>
              <Select label="Priority" defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              <Select label="Team" error="Please choose a team.">
                <option value="">Pick one…</option>
                <option value="core">Core</option>
              </Select>
            </div>
            <div className="demo-col">
              <span className="demo-label">Textarea</span>
              <Textarea label="Note" placeholder="Write something thoughtful…" rows={4} />
              <Textarea
                label="Reflection"
                placeholder="What went well today?"
                error="Could not save — please try again."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Cards ---- */}
      <section className="section">
        <SectionHead title="Cards">Compound card with header, body and footer.</SectionHead>
        <div className="demo-pad">
          <div className="demo-grid-2">
            <Card>
              <CardHeader title="Study session" subtitle="Completed today" icon={CheckCircle2} />
              <CardBody>
                <p className="muted" style={{ margin: 0 }}>
                  A quiet card for daily content — deadlines, progress and reflections live here.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Details</Button>
                <Button size="sm">Mark done</Button>
              </CardFooter>
            </Card>

            <Card hover>
              <CardHeader title="Hover me" subtitle="Cards can lift gently on hover" icon={CalendarDays} />
              <CardBody>
                <p className="muted" style={{ margin: 0 }}>
                  Subtle elevation and a warmer border make interactive cards feel responsive.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* ---- Badges ---- */}
      <section className="section">
        <SectionHead title="Badges">Status chips with optional alert dots.</SectionHead>
        <div className="demo-pad">
          <div className="demo-row">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="soft">Soft green</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success" dot>Done</Badge>
            <Badge variant="warning" dot>Review</Badge>
            <Badge variant="danger" dot>Overdue</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      </section>

      {/* ---- Modal ---- */}
      <section className="section">
        <SectionHead title="Modal">Esc closes, backdrop click closes, focus is contained visually.</SectionHead>
        <div className="demo-pad">
          <span className="demo-label">Overlay dialog</span>
          <div className="demo-row">
            <Button variant="secondary" onClick={() => setModalOpen(true)} leftIcon={Plus}>
              Open example modal
            </Button>
          </div>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Welcome to the design system"
          icon={CheckCircle2}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setModalOpen(false)}>Sounds good</Button>
            </>
          }
        >
          <p>
            This is the modal foundation — composed, calm, and accessible. Headers carry an optional
            icon, and footer buttons align right. Escape or the backdrop will dismiss it.
          </p>
          <div className="demo-row">
            <Badge variant="soft">Esc</Badge>
            <Badge variant="neutral">Backdrop click</Badge>
            <Badge variant="neutral">Close button</Badge>
          </div>
        </Modal>
      </section>

      {/* ---- Dropdown ---- */}
      <section className="section">
        <SectionHead title="Dropdowns">Menus close on outside click or Escape.</SectionHead>
        <div className="demo-pad">
          <span className="demo-label">Menu</span>
          <div className="demo-row">
            <Dropdown trigger={<Button variant="outline" rightIcon={ChevronDown}>Account menu</Button>}>
              <DropdownItem icon={User}>View profile</DropdownItem>
              <DropdownItem icon={Settings}>Settings</DropdownItem>
              <DropdownCaption>Workspace</DropdownCaption>
              <DropdownDivider />
              <DropdownItem danger icon={LogOut}>Log out</DropdownItem>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* ---- Progress ---- */}
      <section className="section">
        <SectionHead title="Progress">Determinate and indeterminate indicators.</SectionHead>
        <div className="demo-pad">
          <div className="demo-grid-2">
            <div className="demo-col">
              <span className="demo-label">Determinate</span>
              <Progress label="Semester complete" value={72} />
              <Progress label="Quiet mode" value={40} tone="accent" size="sm" />
              <Progress label="Uploading" value={95} size="lg" />
            </div>
            <div className="demo-col">
              <span className="demo-label">Indeterminate</span>
              <ProgressIndeterminate />
              <ProgressIndeterminate size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Loading ---- */}
      <section className="section">
        <SectionHead title="Loading states">Spinners, loading buttons and skeletons.</SectionHead>
        <div className="demo-pad">
          <div className="demo-row">
            <Spinner />
            <Spinner tone="primary" />
            <Spinner tone="accent" size="lg" />
            <Button loading>Working…</Button>
            <Avatar name="Loading" size="lg" />
          </div>
          <div className="demo-grid-2">
            <div className="demo-col">
              <span className="demo-label">List skeleton</span>
              <SkeletonLines lines={4} />
            </div>
            <div className="demo-col">
              <span className="demo-label">Full page</span>
              <PageLoading />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Empty & Error ---- */}
      <section className="section">
        <SectionHead title="Empty & error states">Friendly first-run and failure moments.</SectionHead>
        <div className="demo-pad">
          <div className="demo-grid-2">
            <EmptyState
              icon={Inbox}
              title="Nothing here yet"
              description="When you start a module, its content will appear here. Until then — breathe."
              action={
                <Button variant="secondary" size="sm" leftIcon={Plus}>
                  Add your first item
                </Button>
              }
            />
            {recovered ? (
              <div className="empty-state" style={{ border: 'none', background: 'transparent' }}>
                <div className="empty-state-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                  <CheckCircle2 size={26} />
                </div>
                <h3>Recovered</h3>
                <p>That simulated failure? Handled. Error states recover gracefully.</p>
              </div>
            ) : (
              <ErrorState
                icon={AlertTriangle}
                title={errorRetries ? `Retry attempt ${errorRetries}` : 'Could not load this section'}
                message="The connection hiccuped. Try again — this ErrorState includes an action button."
                onRetry={handleRetry}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}